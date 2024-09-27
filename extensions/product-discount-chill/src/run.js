// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Target} Target
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

/**
 * The configured entry point for the 'purchase.product-discount.run' extension target
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const complimentaryDiscount = {
    message: "Complimentary Discount",
    percentage: 100,
  };

  const globalMessage = "Complementry product";
  
  const varietyPackLines = input.cart.lines.find(line => {
    const isFreeProduct = line.freeProduct;
    if(isFreeProduct != null){
      const orderCount  = parseInt(line.orderCount.value);
    if(isFreeProduct.value && orderCount < 1) {
      return isFreeProduct;
    }
  }
  })


  // If no qualifying variety pack products are found, return no discount
  if (!varietyPackLines) {
    console.error("No variety pack products found.");
    return EMPTY_DISCOUNT;
  }

  const discountTargets = [];


  // Apply 100% discount to only the first variety pack product
  discountTargets.push({
    cartLine: {
      id: varietyPackLines.id,
      quantity: 1
    },
  });

  // Prepare the discount object
  const discount = {
    targets: discountTargets,
    message: globalMessage,
    value: {
      percentage: {
        value: complimentaryDiscount.percentage,
      },
    },
  };

  return {
    discounts: [discount],
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
}
