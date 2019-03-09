import { findGeodesicDistance } from "./geodesic";

export function findBilateralMap(graph, source, target) {
    const { path } = findGeodesicDistance(graph, source, target);



    return {
        path,
    };
}
