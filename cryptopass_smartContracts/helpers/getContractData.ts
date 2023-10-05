// Assuming the shape of your contractData.json. Modify as needed.
interface ContractData {
  [key: string]: any; // This is generic, make it more specific if you know the exact structure
}

export const getContractData = async (contractName: string): Promise<any> => {
  console.log("Running getContractData!");
  const allContractData: ContractData = await import("../contractData.json");
  return findNestedObj(allContractData, contractName.toLowerCase());
};

function findNestedObj<T extends Record<string, any>>(
  obj: T,
  keyToFind: string
): any {
  if (obj.hasOwnProperty(keyToFind)) {
    return obj[keyToFind];
  }

  for (let key in obj) {
    if (obj[key] && typeof obj[key] === "object") {
      let result = findNestedObj(obj[key], keyToFind);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

// Example usage
// const data = {
//   a: {
//     b: {
//       c: {
//         d: "value",
//       },
//     },
//   },
//   e: "another value",
// };

// console.log(findNestedObj(data, "c")); // { d: 'value' }
// console.log(findNestedObj(data, "e")); // 'another value'
// console.log(findNestedObj(data, "x")); // null
