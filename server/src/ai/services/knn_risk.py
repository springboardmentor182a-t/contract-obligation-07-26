import numpy as np
from sklearn.neighbors import KNeighborsRegressor
from sklearn.preprocessing import StandardScaler
from typing import Dict, Any, List, Optional

class KNNRiskModel:
    def __init__(self, n_neighbors: int = 5):
        self.n_neighbors = n_neighbors
        self.scaler = StandardScaler()
        self.model = KNeighborsRegressor(n_neighbors=self.n_neighbors, weights='distance')
        self.is_trained = False
        self.train_mock_model()

    def train_mock_model(self, n_samples: int = 250):
        """
        Generates synthetic training dataset and fits the KNN regressor.
        Features:
        0: Contract Value ($) [e.g. 5,000 to 1,500,000]
        1: Term Length (months) [e.g. 1 to 60]
        2: Vendor Risk History (1-10 scale)
        3: Compliance Flags Count [0 to 8]
        4: Uncapped Liability (0 or 1)
        """
        np.random.seed(42)
        
        # Feature 0: Contract Value
        values = np.random.exponential(scale=150000, size=n_samples) + 5000
        values = np.clip(values, 5000, 2000000)
        
        # Feature 1: Term Length (months)
        terms = np.random.randint(1, 61, size=n_samples)
        
        # Feature 2: Vendor Risk History (1 to 10)
        vendor_risk = np.random.uniform(1.0, 10.0, size=n_samples)
        
        # Feature 3: Compliance Flags Count (0 to 8)
        compliance_flags = np.random.poisson(lam=1.5, size=n_samples)
        compliance_flags = np.clip(compliance_flags, 0, 8)
        
        # Feature 4: Uncapped Liability (0 or 1)
        uncapped = np.random.binomial(n=1, p=0.25, size=n_samples)
        
        X = np.column_stack([values, terms, vendor_risk, compliance_flags, uncapped])
        
        # Synthesize target risk score (0 to 100)
        # Base formula + noise
        y = (
            (values / 2000000.0) * 25.0 +
            (terms / 60.0) * 15.0 +
            (vendor_risk / 10.0) * 30.0 +
            (compliance_flags / 8.0) * 20.0 +
            (uncapped * 20.0) +
            np.random.normal(0, 3, size=n_samples)
        )
        y = np.clip(y, 2.0, 98.0)
        
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        self.is_trained = True
        return {"status": "trained", "samples": n_samples}

    def predict_risk(
        self, 
        contract_value: float, 
        term_months: int = 12, 
        vendor_risk_history: float = 3.5, 
        compliance_flags: int = 0, 
        uncapped_liability: int = 0
    ) -> Dict[str, Any]:
        """
        Predicts continuous risk score (0-100) for a given contract profile.
        """
        if not self.is_trained:
            self.train_mock_model()
            
        raw_features = np.array([[
            float(contract_value), 
            float(term_months), 
            float(vendor_risk_history), 
            float(compliance_flags), 
            float(uncapped_liability)
        ]])
        
        scaled_features = self.scaler.transform(raw_features)
        score = float(self.model.predict(scaled_features)[0])
        score = round(max(1.0, min(99.0, score)), 1)
        
        # Nearest neighbors distances and indices
        distances, indices = self.model.kneighbors(scaled_features)
        avg_distance = float(np.mean(distances[0]))
        
        # Determine risk tier & color indicator
        if score < 30.0:
            tier = "Low"
            category = "Safe"
            color = "emerald"
        elif score < 60.0:
            tier = "Medium"
            category = "Moderate Risk"
            color = "amber"
        elif score < 80.0:
            tier = "High"
            category = "High Exposure"
            color = "rose"
        else:
            tier = "Critical"
            category = "Severe Liability"
            color = "red"
            
        # Key driver breakdown
        drivers = []
        if contract_value > 250000:
            drivers.append(f"High portfolio valuation (${contract_value:,.0f})")
        if uncapped_liability == 1:
            drivers.append("Uncapped indemnification liability clause")
        if compliance_flags > 0:
            drivers.append(f"{compliance_flags} unresolved regulatory compliance flag(s)")
        if vendor_risk_history > 6.0:
            drivers.append(f"Elevated vendor historical risk rating ({vendor_risk_history}/10)")
        if term_months > 36:
            drivers.append(f"Long-term commitment horizon ({term_months} months)")
            
        if not drivers:
            drivers.append("Standard commercial terms within risk tolerance")

        return {
            "risk_score": score,
            "risk_tier": tier,
            "category": category,
            "color": color,
            "confidence": round(max(0.75, 1.0 - (avg_distance * 0.1)), 2),
            "k_neighbors": self.n_neighbors,
            "drivers": drivers,
            "metrics": {
                "contract_value": contract_value,
                "term_months": term_months,
                "vendor_risk_history": vendor_risk_history,
                "compliance_flags": compliance_flags,
                "uncapped_liability": bool(uncapped_liability)
            }
        }

# Global singleton instance
knn_service = KNNRiskModel()
