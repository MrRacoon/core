'use strict';

const { add, multiply, divide, distanceSquared,  } = require('../geometry/point');

/**
 * Creates clusters of units by distance between them. Right now only used for expansions.
 * @param {Unit[]} units 
 * @param {number} distanceApart 
 * @returns {Cluster[]}
 */
function createClusters(units, distanceApart = 15.0) {
    const squaredDistanceApart = distanceApart * distanceApart;

    return units.reduce((clusters, u) => {
        /**
         * @type {{ distance: number, target: Cluster }}
         */
        const { distance, target } = clusters.reduce((acc, b) => {
            const d = distanceSquared(u.pos, b.centroid);

            if (d < acc.distance) {
                return { distance: d, target: b };
            } else {
                return acc;
            }
        }, { distance: Infinity, target: null });

        if (distance > squaredDistanceApart) {
            return clusters.concat([{ centroid: u.pos, mineralFields: [u] }]);
        } else {
            target.mineralFields = [...target.mineralFields, u];
            const size = target.mineralFields.length;
            target.centroid = divide(add(multiply(target.centroid, (size - 1)), u.pos), size);
            return clusters;
        }
    }, []);
}

module.exports = createClusters;