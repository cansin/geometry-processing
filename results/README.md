# Notes

## Geodesic Distances on Meshes

There was not anything surprising with Geodesic distance 
implementation. The Fibonacci heap was quite noticeably 
more performant than a naive Set implementation as expected.

Also, using an early exit strategy when the `target` node is
known resulted in an even shorter execution time.

## Sampling and Descriptors on Meshes

### Farthest Point Sampling

Using inversed distances in a Fibonacci Heap helped with the
performance of finding the next point to sample 
(i.e. the point with maximum distance to its cluster root)

Also, dropping the initial randomly chosen point as soon
as the second point is sampled resulted in a more accurate
sample set. 

### Geodesic Iso-Curve Signature

The Iso-Curve Signature paper was not very clear on how the 
distribution of Iso-Curve radii. They were mentioning an x to 
the power of 4 function to use for selecting radii, yet that
resulted in a very poor distribution. Therefore, I opted
to use 20 uniformly sampled Iso-Curve radii. 

Also, I needed to de-dupe the Iso-Curves created with the 
intersection formula given by the paper. For each radius,
I was ending up creating 2 very closely resembling curves.

### Bilateral Maps

In order to not create a graph using `faces`, and instead be 
able to re-use the existing `vertices` graph, I ended up
relying on a heuristic to estimate a face's distance to the 
geodesic path. The estimation used the average geodesic distances
of a face's vertices and assigned it as the face's own distance.

Later, while calculating the Bilateral Maps' bin values, I relied
on Heron's formula in order to find the area of a triangle using 
the 3 edge lengths.
