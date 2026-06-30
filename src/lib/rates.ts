interface LenderRate {
  lender: string;
  rate: number;
}

type InsuredBucket = "insured" | "conventional";

const PURCHASE_FIXED: Record<number, Record<InsuredBucket, LenderRate[]>> = {
  1: {
    conventional: [
      { lender: "BMO", rate: 5.37 },
      { lender: "Desjardins", rate: 5.49 },
      { lender: "MCAP", rate: 5.59 },
    ],
    insured: [
      { lender: "Strive", rate: 4.94 },
      { lender: "RFA", rate: 5.09 },
      { lender: "NEO", rate: 5.09 },
    ],
  },
  2: {
    conventional: [
      { lender: "BMO", rate: 4.75 },
      { lender: "MCAP", rate: 4.99 },
      { lender: "RMG", rate: 4.99 },
    ],
    insured: [
      { lender: "RFA", rate: 4.54 },
      { lender: "Strive", rate: 4.64 },
      { lender: "MCAP", rate: 4.64 },
    ],
  },
  3: {
    conventional: [
      { lender: "Desjardins", rate: 4.34 },
      { lender: "BMO", rate: 4.69 },
      { lender: "Lendwise/Merix", rate: 4.79 },
    ],
    insured: [
      { lender: "Desjardins", rate: 4.29 },
      { lender: "RFA", rate: 4.34 },
    ],
  },
  4: {
    conventional: [
      { lender: "Desjardins", rate: 4.39 },
      { lender: "BMO", rate: 4.69 },
      { lender: "Lendwise/Merix", rate: 4.79 },
    ],
    insured: [
      { lender: "Desjardins", rate: 4.29 },
      { lender: "Lendwise/Merix", rate: 4.39 },
      { lender: "RFA", rate: 4.39 },
    ],
  },
  5: {
    conventional: [
      { lender: "RMG", rate: 4.00 },
      { lender: "Strive", rate: 4.10 },
      { lender: "Desjardins", rate: 4.10 },
    ],
    insured: [
      { lender: "National Bank", rate: 3.55 },
      { lender: "Meridian Credit Union", rate: 3.59 },
      { lender: "Radius Financial", rate: 3.60 },
    ],
  },
  7: {
    conventional: [
      { lender: "National Bank", rate: 4.69 },
      { lender: "Desjardins", rate: 4.79 },
      { lender: "First National", rate: 5.09 },
    ],
    insured: [
      { lender: "National Bank", rate: 4.54 },
      { lender: "Desjardins", rate: 4.64 },
      { lender: "Scotiabank", rate: 5.05 },
    ],
  },
  10: {
    conventional: [
      { lender: "National Bank", rate: 5.14 },
      { lender: "Desjardins", rate: 5.34 },
      { lender: "First National", rate: 5.44 },
    ],
    insured: [
      { lender: "National Bank", rate: 4.99 },
      { lender: "Desjardins", rate: 5.34 },
      { lender: "First National", rate: 5.44 },
    ],
  },
};

const PURCHASE_VARIABLE: Record<InsuredBucket, LenderRate[]> = {
  conventional: [
    { lender: "National Bank", rate: 3.75 },
    { lender: "Meridian Credit Union", rate: 3.79 },
    { lender: "NEO", rate: 3.80 },
  ],
  insured: [
    { lender: "National Bank", rate: 3.55 },
    { lender: "Meridian Credit Union", rate: 3.59 },
    { lender: "NEO", rate: 3.60 },
  ],
};

const PURCHASE_ADJUSTABLE: Record<InsuredBucket, LenderRate[]> = {
  conventional: [
    { lender: "First National", rate: 3.95 },
    { lender: "CMLS Financial", rate: 4.29 },
    { lender: "Radius Financial", rate: 4.35 },
  ],
  insured: [
    { lender: "Radius Financial", rate: 3.60 },
    { lender: "First National", rate: 3.64 },
    { lender: "MCAN", rate: 3.85 },
  ],
};

const REFINANCE_FIXED: Record<number, LenderRate[]> = {
  1: [
    { lender: "Scotiabank", rate: 4.69 },
    { lender: "Optimum Mortgage", rate: 4.89 },
    { lender: "Scotiabank", rate: 4.94 },
  ],
  2: [
    { lender: "Scotiabank", rate: 4.09 },
    { lender: "National Bank", rate: 4.24 },
    { lender: "National Bank", rate: 4.24 },
  ],
  3: [
    { lender: "National Bank", rate: 3.94 },
    { lender: "National Bank", rate: 4.04 },
    { lender: "Scotiabank", rate: 4.14 },
  ],
  4: [
    { lender: "National Bank", rate: 4.04 },
    { lender: "National Bank", rate: 4.14 },
    { lender: "Scotiabank", rate: 4.29 },
  ],
};

export const PURCHASE_FIXED_TERMS = [1, 2, 3, 4, 5, 7, 10];
export const REFINANCE_FIXED_TERMS = [1, 2, 3, 4];

export interface RateLookupInput {
  propertyType: string;
  purchasePrice?: number | null;
  downPayment?: number | null;
  rateType?: string | null;
  term?: number | null;
}

export interface RateEstimate {
  available: boolean;
  rate?: number;
  termLabel?: string;
  insuredStatus?: "Insured" | "Conventional";
  message?: string;
}

function bestRate(rates: LenderRate[] | undefined): number | null {
  if (!rates || rates.length === 0) return null;
  return Math.min(...rates.map((r) => r.rate));
}

export function getEstimatedRate(input: RateLookupInput): RateEstimate {
  const { propertyType, purchasePrice, downPayment, rateType, term } = input;

  if (propertyType === "PURCHASE") {
    const insured =
      !!purchasePrice && purchasePrice > 0 && downPayment != null
        ? downPayment / purchasePrice < 0.2
        : false;
    const bucket: InsuredBucket = insured ? "insured" : "conventional";
    const insuredStatus = insured ? "Insured" : "Conventional";

    if (rateType === "FIXED" && term) {
      const rate = bestRate(PURCHASE_FIXED[term]?.[bucket]);
      if (rate == null) {
        return { available: false, message: "We don't have a Hub rate on file for that exact term yet." };
      }
      return { available: true, rate, termLabel: `${term} Year Fixed`, insuredStatus };
    }
    if (rateType === "VARIABLE") {
      const rate = bestRate(PURCHASE_VARIABLE[bucket]);
      if (rate == null) return { available: false };
      return { available: true, rate, termLabel: "Variable", insuredStatus };
    }
    if (rateType === "ADJUSTABLE") {
      const rate = bestRate(PURCHASE_ADJUSTABLE[bucket]);
      if (rate == null) return { available: false };
      return { available: true, rate, termLabel: "Adjustable", insuredStatus };
    }
  }

  if (propertyType === "REFINANCE") {
    if (rateType === "FIXED" && term) {
      const rate = bestRate(REFINANCE_FIXED[term]);
      if (rate == null) {
        return { available: false, message: "We don't have a Hub rate on file for that exact term yet." };
      }
      return { available: true, rate, termLabel: `${term} Year Fixed` };
    }
    return {
      available: false,
      message: "Variable and adjustable refinance rates vary by lender — I'll pull current options for you directly.",
    };
  }

  return {
    available: false,
    message: "This type of mortgage is highly individualized — I'll prepare a personalized rate quote for you.",
  };
}
