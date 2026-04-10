import React, { useState } from "react";
import { supabase } from "../../utils/supabase";
import CheckoutModal from "../checkout/CheckoutModal";
import type { CheckoutConfig } from "../checkout/CheckoutModal";

interface Course {
  id: string;
  name: string;
  commitment_fee: number;
}

interface CourseApplicationFormProps {
  course: Course;
  onClose: () => void;
}

const CourseApplicationForm: React.FC<CourseApplicationFormProps> = ({
  course,
  onClose,
}) => {
  const [showCheckout, setShowCheckout] = useState(true);

  if (!showCheckout) return null;

  const checkoutConfig: CheckoutConfig = {
    item: {
      id: course.id,
      name: course.name,
      description: `Commitment fee for ${course.name}`,
      amount: course.commitment_fee,
    },
    context: "courses",
    enableCoupons: true,
    enableInstallments: false,
    extraFields: [
      {
        name: "has_experience",
        label: "Prior Experience",
        type: "checkbox",
        placeholder: "I have some prior experience or knowledge in this field",
      },
    ],
    metadata: {
      type: "course",
      course_id: course.id,
      course_name: course.name,
      payment_type: "course_commitment_fee",
    },
    onBeforePayment: async ({ customer, couponCode, extraData }) => {
      const paymentRef = `COURSE-${course.id}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

      const { error: dbError } = await supabase
        .from("course_applications")
        .insert([
          {
            course_id: course.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            has_experience: extraData.has_experience === "true",
            payment_reference: paymentRef,
            payment_status: "pending",
            status: "pending",
            coupon_code: couponCode || null,
          },
        ])
        .select()
        .single();

      if (dbError) throw dbError;
    },
    onClose: () => {
      setShowCheckout(false);
      onClose();
    },
  };

  return <CheckoutModal {...checkoutConfig} />;
};

export default CourseApplicationForm;
