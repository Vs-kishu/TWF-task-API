// Constants
const stockTable = {
    'C1': [
        {"product": "A", "weight": 3},
        {"product": "B", "weight": 2},
        {"product": "C", "weight": 8}
    ],
    'C2': [
        {"product": "D", "weight": 12},
        {"product": "E", "weight": 25},
        {"product": "F", "weight": 15}
    ],
    'C3': [
        {"product": "G", "weight": 0.5},
        {"product": "H", "weight": 1},
        {"product": "I", "weight": 2}
    ]
};

const distances = {
    'C1': { 'L1': 3 },
    'C2': { 'L1': 2.5, 'C1': 4, 'C3': 3 },
    'C3': { 'L1': 2, 'C2': 3 }
};

const bellmanFord=(distances, start)=>{
    const distance = {};
    distance[start] = 0;

    for (let i = 0; i < Object.keys(distances).length - 1; i++) {
        for (const node in distances) {
            for (const neighbor in distances[node]) {
                const cost = distances[node][neighbor];
                if (distance[node] + cost < (distance[neighbor] || Infinity)) {
                    distance[neighbor] = distance[node] + cost;
                }
            }
        }
    }

    return { distance };
}


// Precompute shortest paths
const shortestPaths = {};
for (const center in distances) {
    const { distance } = bellmanFord(distances, center);
    shortestPaths[center] = distance;
}



const totalWeightAtCenter=(order) =>{
    const result = {};
    for (const center in stockTable) {
        let totalWeight = 0;
        for (const productObj of stockTable[center]) {
            if (order.hasOwnProperty(productObj.product) && order[productObj.product] > 0) {
                totalWeight += productObj.weight * order[productObj.product];
            }
        }
        result[center] = totalWeight;
    }
    return result;
}


const calculateCost=async (orders)=> {
    try {
        let totalCost = 0;
        let flag = 0; // Initialize flag
        for (const center in orders) {
            if (orders[center] > 0) {
                const minDistanceToL1 = shortestPaths[center]['L1'];
                const totalWeight = orders[center];
                const complete5KgUnits = Math.floor(totalWeight / 5);
                totalCost += complete5KgUnits * 8 * minDistanceToL1;
                const remainingWeight = totalWeight - complete5KgUnits * 5;
                if (remainingWeight > 0) {
                    totalCost += 10 * minDistanceToL1;
                }
                if (flag) totalCost += 10 * minDistanceToL1; 
                flag = 1;
            }
        }
        return totalCost;
    } catch (error) {
        throw new Error(`Error calculating cost: ${error.message}`);
    }
}

module.exports={totalWeightAtCenter,calculateCost}