// src/lib/error-handler.js

import { toast } from "sonner";

// Define known RPC error codes (optional but helpful for readability)
const ERROR_CODE_USER_REJECTED = 4001;
const ETHERS_ACTION_REJECTED = 'ACTION_REJECTED';
const ETHERS_CALL_EXCEPTION = 'CALL_EXCEPTION';
const ETHERS_INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS';
const ETHERS_NETWORK_ERROR = 'NETWORK_ERROR';
const ETHERS_NONCE_EXPIRED = 'NONCE_EXPIRED';
const ETHERS_REPLACEMENT_UNDERPRICED = 'REPLACEMENT_UNDERPRICED';
const ETHERS_UNPREDICTABLE_GAS_LIMIT = 'UNPREDICTABLE_GAS_LIMIT';

/**
 * Parses RPC errors and displays a user-friendly toast notification.
 * @param {any} error The error object received from an RPC call (e.g., ethers.js, viem).
 * @param {string} [customPrefix] Optional prefix for the toast message (e.g., "Registration failed").
 */
export function handleRpcError(error, customPrefix) {
  // Log the full error for developers in the console
  console.error("RPC Error encountered:", error);

  let message = "An unknown error occurred.";
  const prefix = customPrefix ? `${customPrefix}: ` : "Error: ";

  if (error) {
    // Try to extract message based on common error structures
    const code = error.code;
    const reason = error.reason; // Often present in contract revert errors (ethers.js v5/v6)
    const dataMessage = error.data?.message; // Sometimes nested message
    const errorDataMessage = error.error?.data?.message; // Deeper nesting
    const shortMessage = error?.shortMessage; // Viem style
    const causeMessage = error?.cause?.shortMessage; // Viem nested style
    const errorMessage = (error.message || '').toLowerCase(); // General message

    // 1. User Rejected Transaction
    if (
      code === ERROR_CODE_USER_REJECTED ||
      code === ETHERS_ACTION_REJECTED ||
      errorMessage.includes("user rejected") ||
      errorMessage.includes("user denied") ||
      shortMessage?.includes("User rejected the request")
    ) {
      message = "Transaction rejected by user.";
    }
    // 2. Contract Revert / Call Exception (ethers.js)
    else if (code === ETHERS_CALL_EXCEPTION) {
       message = reason ? `Transaction reverted: ${reason}` : "Transaction failed: Contract execution reverted.";
       // Try to extract better reason if not directly available
       if (!reason) {
         const revertReasonMatch = errorMessage.match(/reason="([^"]+)"/);
         if (revertReasonMatch?.[1]) {
           message = `Transaction reverted: ${revertReasonMatch[1]}`;
         } else if (errorMessage.includes('execution reverted')) {
             const executionRevertedIndex = errorMessage.indexOf('execution reverted');
             // Extract potential reason after 'execution reverted', clean it up
             const potentialReason = errorMessage.substring(executionRevertedIndex + 'execution reverted'.length).trim().replace(/['"`].*$/, '').replace(/^[:\s]+/, '');
             if (potentialReason && potentialReason.length < 100) { // Check if it looks like a reasonable reason
                 message = `Transaction reverted: ${potentialReason}`;
             }
         }
       }
    }
     // 3. Viem specific revert handling (more robust)
    else if (shortMessage?.startsWith('execution reverted')) {
        const detail = shortMessage.split('execution reverted: ')[1] || 'Reason not provided';
        message = `Transaction reverted: ${detail}`;
    } else if (causeMessage?.startsWith('execution reverted')) {
        const detail = causeMessage.split('execution reverted: ')[1] || 'Reason not provided';
        message = `Transaction reverted: ${detail}`;
    }
    // 4. Insufficient Funds
    else if (
      code === ETHERS_INSUFFICIENT_FUNDS ||
      errorMessage.includes("insufficient funds") ||
      shortMessage?.includes("insufficient funds")
    ) {
      message = "Insufficient funds to complete the transaction.";
    }
    // 5. Network Error
    else if (code === ETHERS_NETWORK_ERROR) {
      message = "Network error. Please check your connection or RPC provider.";
    }
    // 6. Nonce Issues
    else if (
        code === ETHERS_NONCE_EXPIRED ||
        code === ETHERS_REPLACEMENT_UNDERPRICED ||
        errorMessage.includes("nonce") ||
        shortMessage?.includes("nonce too low") ||
        shortMessage?.includes("replacement transaction underpriced")
    ) {
        message = "Transaction nonce error. Please try again, or reset your wallet account if the issue persists.";
    }
    // 7. Gas Estimation Failed (often hides an underlying revert)
    else if (
        code === ETHERS_UNPREDICTABLE_GAS_LIMIT ||
        shortMessage?.includes("cannot estimate gas") ||
        errorMessage.includes("gas required exceeds allowance") // Another common cause
        ) {
        message = "Cannot estimate gas. Transaction may fail.";
        // Attempt to find nested reason
        const nestedReason = error.error?.message || errorDataMessage || causeMessage || '';
        if (nestedReason.includes('execution reverted')) {
             message += ` Potential reason: ${nestedReason.substring(nestedReason.indexOf('execution reverted'))}`;
        } else if (nestedReason.includes("insufficient allowance")) {
             message += " Check token allowance.";
        } else if (nestedReason.includes("insufficient balance")) {
            message = "Insufficient funds."; // Overwrite if more specific
        }
    }
    // 8. Other known reasons (extracted from messages)
    else if (reason) {
      message = `Transaction failed: ${reason}`;
    } else if (shortMessage && shortMessage.length < 150) { // Use viem short message if reasonable
        message = shortMessage;
    } else if (dataMessage) {
      message = dataMessage;
    } else if (errorDataMessage) {
      message = errorDataMessage;
    }
    // 9. Fallback to generic error message if available and reasonable length
    else if (error.message && error.message.length < 150) {
      message = error.message;
    }
  }

  // Display the toast notification using sonner
  toast.error(`${prefix}${message}`);
}