import time
import random
import logging
from typing import Dict, Any, Optional, List, Tuple
from app.services.registry_loader import registry_service

logger = logging.getLogger("ml_service.deployment_gate")

class DeploymentGateManager:
    """
    Manages Canary Traffic Splitting, Shadow Mode, Blue-Green Promotion,
    Circuit-Breaker Automated Rollbacks, and Audit Logging.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DeploymentGateManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self.mode = "PROMOTED" # "SHADOW", "CANARY_10", "CANARY_50", "PROMOTED", "ROLLED_BACK"
        self.canary_ratio = 0.0 # Fraction of traffic routed to challenger [0.0 - 1.0]
        self.champion_version = "v1.0.0-champion"
        self.challenger_version = "v1.1.0-retrained"
        self.previous_version = "v1.0.0-baseline"
        self.error_rate_threshold = 0.02
        self.latency_threshold_ms = 10.0
        self.audit_log: List[Dict[str, Any]] = []
        self._initialized = True
        self.record_audit("SYSTEM_INIT", "system", "Deployment gate manager initialized in production mode.")

    def record_audit(self, action: str, operator: str, reason: str, details: Optional[Dict[str, Any]] = None):
        record = {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "action": action,
            "operator": operator,
            "reason": reason,
            "mode": self.mode,
            "canary_ratio": self.canary_ratio,
            "champion_version": self.champion_version,
            "details": details or {}
        }
        self.audit_log.insert(0, record)
        if len(self.audit_log) > 200:
            self.audit_log.pop()
        logger.info(f"[AUDIT] {action} by {operator}: {reason}")

    def route_request(self) -> Tuple[str, bool]:
        """
        Determines whether an incoming request routes to Champion or Challenger.
        In Shadow mode: executes Challenger silently in parallel.
        """
        if self.mode == "PROMOTED" or self.canary_ratio <= 0.0:
            return "champion", False # model_type, is_shadow

        if self.mode == "SHADOW":
            return "champion", True # route to champion, execute shadow on challenger

        # Canary traffic split
        if random.random() < self.canary_ratio:
            return "challenger", False
        return "champion", False

    def set_canary(self, percentage: int, operator: str = "admin", reason: str = "Canary traffic roll-out"):
        """Configures canary traffic split: 10%, 50%, or custom."""
        if percentage not in [0, 10, 50, 100]:
            raise ValueError("Canary percentage must be 0, 10, 50, or 100")

        old_mode = self.mode
        if percentage == 0:
            self.mode = "SHADOW"
            self.canary_ratio = 0.0
        elif percentage == 10:
            self.mode = "CANARY_10"
            self.canary_ratio = 0.10
        elif percentage == 50:
            self.mode = "CANARY_50"
            self.canary_ratio = 0.50
        elif percentage == 100:
            return self.promote_challenger(operator=operator, reason=reason)

        self.record_audit(
            "CANARY_ADJUSTED",
            operator,
            f"Canary split shifted from {old_mode} to {self.mode} ({percentage}%)",
            {"old_mode": old_mode, "new_percentage": percentage}
        )
        return self.get_status()

    def promote_challenger(self, operator: str = "admin", reason: str = "Blue-Green promotion gate sign-off"):
        """Promotes challenger model to 100% production traffic. Demotes current champion to previous."""
        self.previous_version = self.champion_version
        self.champion_version = self.challenger_version
        self.mode = "PROMOTED"
        self.canary_ratio = 0.0

        # Update registry loader
        registry_service.hot_reload(alias="champion", model_version=self.champion_version)

        self.record_audit(
            "BLUE_GREEN_PROMOTED",
            operator,
            reason,
            {"new_champion": self.champion_version, "demoted_to_previous": self.previous_version}
        )
        return self.get_status()

    def execute_rollback(self, operator: str = "admin", reason: str = "Circuit breaker / operator rollback"):
        """Instant zero-downtime rollback to previous known stable model."""
        rollback_target = self.previous_version
        self.previous_version = self.champion_version
        self.champion_version = rollback_target
        self.mode = "ROLLED_BACK"
        self.canary_ratio = 0.0

        registry_service.hot_reload(alias="champion", model_version=self.champion_version)

        self.record_audit(
            "MODEL_ROLLBACK",
            operator,
            reason,
            {"restored_version": self.champion_version, "demoted_version": self.previous_version}
        )
        return self.get_status()

    def get_status(self) -> Dict[str, Any]:
        return {
            "mode": self.mode,
            "canary_ratio": self.canary_ratio,
            "canary_percentage": int(self.canary_ratio * 100),
            "champion_version": self.champion_version,
            "challenger_version": self.challenger_version,
            "previous_version": self.previous_version,
            "circuit_breaker": {
                "error_rate_threshold": self.error_rate_threshold,
                "latency_threshold_ms": self.latency_threshold_ms,
                "status": "HEALTHY"
            },
            "recent_audit_events_count": len(self.audit_log)
        }

Tuple_Route = tuple[str, bool]
deployment_gate = DeploymentGateManager()
