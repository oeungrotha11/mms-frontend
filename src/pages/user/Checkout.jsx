import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from '../../components/admincomponents/PageHeader';
import API from "../../api/axios";
import { showError, showSuccess } from '../../utils/swal';

const paymentMethods = [
  "ABA Pay",
  "Credit/Debit Card",
  "Acleda Pay",
  "Wing Bank"
];

export default function Checkout() {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [method, setMethod] = useState(paymentMethods[0]);
  const [paymentInfo, setPaymentInfo] = useState("");
  const [cardInfo, setCardInfo] = useState({ cardHolder: "", cardNumber: "", expiry: "", cvv: "" });
  const [loading, setLoading] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [proRateData, setProRateData] = useState(null);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const res = await API.get("/subscriptions/plans");
        setPlans(res.data);
      } catch (err) {
        console.error("Failed to load plans", err);
      }
    };

    const loadCurrentSubscription = async () => {
      try {
        if (currentUser?.id) {
          const res = await API.get(`/subscriptions`);
          const active = res.data.find(s => s.user?._id === currentUser.id && s.status === "active");
          if (active) {
            setCurrentSubscription(active);
          }
        }
      } catch (err) {
        console.error("Failed to load subscription", err);
      }
    };

    loadPlans();
    loadCurrentSubscription();
  }, [currentUser?.id]);

  useEffect(() => {
    const plan = plans.find((p) => p._id === selectedPlanId);
    setSelectedPlan(plan || null);

    // Calculate pro-rate if upgrading
    if (plan && currentSubscription && currentSubscription.plan._id !== plan._id) {
      const now = new Date();
      const totalDays = (new Date(currentSubscription.end_date) - new Date(currentSubscription.start_date)) / (1000 * 60 * 60 * 24);
      const remainingDays = (new Date(currentSubscription.end_date) - now) / (1000 * 60 * 60 * 24);
      
      const oldPlanDailyRate = currentSubscription.plan.price / totalDays;
      const refundAmount = oldPlanDailyRate * remainingDays;
      const chargeAmount = plan.price - refundAmount;

      setProRateData({
        oldPlan: currentSubscription.plan.name,
        refund: refundAmount.toFixed(2),
        newPlanPrice: plan.price,
        charge: chargeAmount.toFixed(2),
        remainingDays: Math.ceil(remainingDays)
      });
    } else {
      setProRateData(null);
    }
  }, [selectedPlanId, plans, currentSubscription]);

  const validate = () => {
    if (!currentUser) {
      showError("You must log in first.");
      navigate("/login");
      return false;
    }

    if (!selectedPlan) {
      showError("Please choose a subscription plan.");
      return false;
    }

    if (!method) {
      showError("Please select a payment method.");
      return false;
    }

    if (method === "Credit/Debit Card") {
      if (!cardInfo.cardHolder.trim() || !cardInfo.cardNumber.trim() || !cardInfo.expiry.trim() || !cardInfo.cvv.trim()) {
        showError("Please fill in all card details.");
        return false;
      }
    } else {
      if (!paymentInfo.trim()) {
        showError("Please enter your bank account or phone number.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      // Check if upgrading or new subscription
      if (currentSubscription && currentSubscription.plan._id !== selectedPlan._id) {
        // Upgrade
        await API.post("/subscriptions/upgrade", {
          userId: currentUser.id,
          newPlanId: selectedPlan._id
        });
        showSuccess("Upgraded successfully! Your new plan is now active.");
      } else {
        // New subscription
        await API.post("/payments", {
          userId: currentUser.id,
          planId: selectedPlan._id,
          method
        });
        showSuccess("Payment successful. Your subscription is active.");
      }

      navigate("/watchmovies");
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentFields = () => {
    if (method === "Credit/Debit Card") {
      return (
        <div style={{ display: 'grid', gap: '12px' }}>
          <label>
            Card holder
            <input
              value={cardInfo.cardHolder}
              onChange={(e) => setCardInfo({ ...cardInfo, cardHolder: e.target.value })}
              placeholder="Name on card"
            />
          </label>
          <label>
            Card number
            <input
              value={cardInfo.cardNumber}
              onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
              placeholder="1234 5678 9012 3456"
            />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <label>
              Expiry
              <input
                value={cardInfo.expiry}
                onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                placeholder="MM/YY"
              />
            </label>
            <label>
              CVV
              <input
                value={cardInfo.cvv}
                onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                placeholder="123"
              />
            </label>
          </div>
        </div>
      );
    }

    return (
      <label>
        Payment reference
        <input
          value={paymentInfo}
          onChange={(e) => setPaymentInfo(e.target.value)}
          placeholder={`Enter your ${method} account or phone number`}
        />
      </label>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <PageHeader title="Checkout" subtitle="Select a plan and payment method" />

      {/* CURRENT PLAN */}
      {currentSubscription && (
        <div style={{ marginBottom: '20px', padding: '16px', borderRadius: '12px', background: '#1a3a3a', borderLeft: '4px solid #22c55e' }}>
          <div style={{ fontSize: '0.875rem', color: '#86efac', marginBottom: '4px' }}>📋 Current Plan</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '1.1rem' }}>{currentSubscription.plan.name}</strong>
              <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                Expires: {new Date(currentSubscription.end_date).toLocaleDateString()} 
                ({Math.ceil((new Date(currentSubscription.end_date) - new Date()) / (1000 * 60 * 60 * 24))} days left)
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Current price</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#22c55e' }}>${currentSubscription.plan.price}</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '20px' }}>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{ fontSize: '0.95rem', color: 'var(--muted)' }}>
            {currentSubscription ? '✨ Upgrade to a better plan' : 'Choose your plan'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {plans.map((plan) => {
              const isCurrentPlan = currentSubscription?.plan._id === plan._id;
              return (
                <button
                  key={plan._id}
                  type="button"
                  onClick={() => setSelectedPlanId(plan._id)}
                  disabled={isCurrentPlan}
                  style={{
                    textAlign: 'left',
                    padding: '18px',
                    borderRadius: '14px',
                    border: selectedPlanId === plan._id ? '2px solid #4f46e5' : isCurrentPlan ? '2px solid #22c55e' : '1px solid rgba(148,163,184,0.3)',
                    background: selectedPlanId === plan._id ? '#111827' : isCurrentPlan ? 'rgba(34, 197, 94, 0.1)' : '#0f172a',
                    cursor: isCurrentPlan ? 'default' : 'pointer',
                    opacity: isCurrentPlan ? 0.6 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <strong>{plan.name}</strong>
                    <span style={{ color: '#22c55e', fontWeight: 700 }}>${plan.price}</span>
                  </div>
                  <p style={{ margin: 0, color: '#94a3b8' }}>{plan.description || `${plan.duration_days} days plan`}</p>
                  <p style={{ marginTop: '10px', color: '#cbd5e1' }}>{plan.devices} devices · {plan.quality}</p>
                  {isCurrentPlan && <p style={{ marginTop: '8px', color: '#22c55e', fontSize: '0.85rem' }}>✓ Current plan</p>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="table-card" style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '16px' }}>Payment details</h3>

          <label>
            Payment method
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              {paymentMethods.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          {renderPaymentFields()}

          {/* PRO-RATE INFO */}
          {proRateData && (
            <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', background: '#3a2a3a', borderLeft: '4px solid #a78bfa' }}>
              <div style={{ fontSize: '0.85rem', color: '#d8b4fe', marginBottom: '8px' }}>💰 Upgrade calculation</div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                <p style={{ margin: '4px 0' }}>Current plan: <strong>{proRateData.oldPlan}</strong> ({proRateData.remainingDays} days left)</p>
                <p style={{ margin: '4px 0' }}>Pro-rate refund: <span style={{ color: '#22c55e' }}>-${proRateData.refund}</span></p>
                <p style={{ margin: '4px 0' }}>New plan: <strong>${proRateData.newPlanPrice}</strong></p>
              </div>
            </div>
          )}

          <div style={{ marginTop: '20px', padding: '16px', borderRadius: '12px', background: '#111827' }}>
            <div style={{ color: '#94a3b8', marginBottom: '8px' }}>Order summary</div>
            {proRateData ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>New plan price</span>
                  <strong>${proRateData.newPlanPrice}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>Pro-rate refund</span>
                  <span style={{ color: '#22c55e' }}>-${proRateData.refund}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #2d3748' }}>
                  <span>Amount to charge</span>
                  <span style={{ color: proRateData.charge > 0 ? '#fbbf24' : '#22c55e' }}>
                    {proRateData.charge > 0 ? `+$${proRateData.charge}` : `$${proRateData.charge}`}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>{selectedPlan?.name || 'No plan selected'}</span>
                  <strong>{selectedPlan ? `$${selectedPlan.price}` : '$0.00'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>Duration</span>
                  <span>{selectedPlan ? `${selectedPlan.duration_days} days` : '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: '8px' }}>
                  <span>Total</span>
                  <span>{selectedPlan ? `$${selectedPlan.price}` : '$0.00'}</span>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              marginTop: '20px',
              width: '100%',
              padding: '14px 0',
              borderRadius: '12px',
              border: 'none',
              background: '#4f46e5',
              color: '#fff',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            {loading ? 'Processing...' : proRateData ? '✨ Upgrade now' : 'Pay now'}
          </button>
        </div>
      </div>
    </div>
  );
}
