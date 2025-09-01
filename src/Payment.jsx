import { useState } from "react";

export default function payment(){

    const [amount, setAmount] = useState(0);

  const handleCheckout = async () => {
    const stripe = window.Stripe("pk_test_51RkQH7LEHMhwphQBLDB1X6QapNUdNEFqrKZhQhAGhFHmrq2gpXivHGMHaGAemOflk6UgPWbyXute7erPXnSNrC4500edOBB9mr"); // publishable key

    try {
      const response = await fetch("http://localhost:8081/create-checkout-session/"+amount, {
        method: "POST",
      });
      const session = await response.json();
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div>
      <p><b>HI.. NELLURI GOPI SANKAR</b></p>
      <h2>ENTER AMOUNT:</h2>
      <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount:" required/>
      <button onClick={handleCheckout}>pay</button>
    </div>
  );
}