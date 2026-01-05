export const BANK_DATA = {
    "Amazon Pay ICICI Credit Card": {
        processingFee: 299,
        rates: {
            3: 15.99,
            6: 15.99,
            9: 15.99,
            12: 15.99,
            18: 15.99,
            24: 15.99
        }
    },
    "American Express Credit Card": {
        processingFee: 199,
        rates: {
            3: 14,
            6: 14,
            9: 14,
            12: 14,
            18: 15,
            24: 15
        }
    },
    "AU Small Finance Bank Credit Card": {
        processingFee: 199,
        rates: {
            3: 14,
            6: 14,
            9: 14,
            12: 14,
            18: 14,
            24: 14
        }
    },
    "Axis Bank Credit Card": {
        processingFee: 299,
        rates: {
            3: 16,
            6: 16,
            9: 16,
            12: 16,
            18: 16,
            24: 16
        }
    },
    "BOBCARD": {
        processingFee: 199,
        rates: {
            3: 16,
            6: 16,
            9: 16,
            12: 16,
            18: 16,
            24: 16,
            36: 16
        }
    },
    "DBS Credit Card InstaEMI": {
        processingFee: 299,
        rates: {
            3: 15,
            6: 15,
            9: 15,
            12: 16,
            18: 16,
            24: 16
        }
    },
    "Federal bank Credit Card EMI": {
        processingFee: 99,
        rates: {
            3: 15.99,
            6: 15.99,
            9: 15.99,
            12: 15.99,
            18: 15.99,
            24: 15.99
        }
    },
    "HDFC Bank Credit Card": {
        processingFee: 299,
        rates: {
            3: 18,
            6: 17,
            9: 17,
            12: 17,
            18: 17,
            24: 17
        }
    },
    "HSBC Bank Credit Card": {
        processingFee: 99,
        rates: {
            3: 15,
            6: 15,
            9: 15,
            12: 15,
            18: 15,
            24: 15
        }
    },
    "ICICI Bank Credit Card": {
        processingFee: 299,
        rates: {
            3: 15.99,
            6: 15.99,
            9: 15.99,
            12: 15.99,
            18: 15.99,
            24: 15.99
        }
    },
    "IDFC FIRST Bank Credit Card": {
        processingFee: 249,
        rates: {
            3: 16,
            6: 16,
            9: 16,
            12: 16,
            18: 16,
            24: 16
        }
    },
    "IndusInd Bank Credit Card": {
        processingFee: 249,
        rates: {
            3: 16,
            6: 16,
            9: 16,
            12: 16,
            18: 16,
            24: 16
        }
    },
    "Jammu and Kashmir Bank Credit Card": {
        processingFee: 99,
        rates: {
            3: 14.99,
            6: 14.99,
            9: 14.99,
            12: 14.99,
            18: 14.99,
            24: 14.99
        }
    },
    "Kotak Mahindra Bank Credit Card": {
        processingFee: 249,
        rates: {
            3: 16,
            6: 16,
            9: 16,
            12: 16,
            18: 16,
            24: 16
        }
    },
    "OneCard": {
        processingFee: 199,
        rates: {
            3: 16,
            6: 16,
            9: 16,
            12: 16,
            18: 16,
            24: 16
        }
    },
    "RBL Bank Credit Card": {
        processingFee: 150,
        rates: {
            3: 13,
            6: 14,
            9: 15,
            12: 15,
            18: 15,
            24: 15
        }
    },
    "SBI Credit Card": {
        processingFee: 299,
        rates: {
            3: 16.75,
            6: 16,
            9: 16,
            12: 15.5,
            18: 15.5,
            24: 15.5
        }
    },
    "Standard Chartered Bank Credit Card": {
        processingFee: 1460,
        rates: {
            3: 11.88,
            6: 14,
            9: 15,
            12: 15,
            18: 15,
            24: 15
        }
    },
    "Yes Bank Credit Card": {
        processingFee: 249,
        rates: {
            3: 16,
            6: 16,
            9: 16,
            12: 16,
            18: 16,
            24: 16
        }
    },
    "ICICI Bank Cardless EMI": {
        processingFee: 199, // Assumption based on text implying processing fee exists; defaulting to standard range if not specified, but usually similar to card. Let's use 199 to be safe/conservative or 0? Text says "apart from processing charge". Using typical 199/299. Set to 199.
        rates: {
            3: 18,
            6: 18,
            9: 18,
            12: 18
        }
    }
};

export const BANKS = Object.keys(BANK_DATA);
