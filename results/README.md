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

## Mesh Parameterization

I first implemented a _free-formed parameterization_ where boundary vertices' 
Z values are simply set to 0. Then I implemented the parameterization where 
boundary vertices are mapped to a circle. 

Both `face` and `faceLow` meshes had an extra boundary within the mouth. It
was not a problem for the _free-formed parameterization_ where I simply fixated
the mouth boundary as I did with the outer face boundary. But with _circle 
parameterization_ I needed to identify which boundary to fixate to the circle. 
I provided two different implementation where either mouth boundary is unpinned 
or pinned with 0 Z-values. 

A proper implementation of that would probably be to 
identify the longest continuous boundary edge and to map it to the circle, 
while keeping other boundaries unpinned. But I simply _hacked_ my way around 
by providing a range of positions where I know mouth would end up in.   

As a final note, I was surprised about how long it is taking for matrix inverse
to be calculated. I initially relied on a popular library called 
[math.js](https://mathjs.org/). But I quickly realized it is just too slow to 
rely on. Later I found an alternative called [ml-matrix](https://mljs.github.io/matrix/)
of which inverse function is 10x times faster than the _mathjs_'s implementation.
It still takes roughly around 2 to 5 minutes for high resolution meshes' matrices
to be inversed. As a follow up, I am hoping to migrate the implementation to
[Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) 
so that the UI won't get frozen when the computationally-heavy code is running. 
