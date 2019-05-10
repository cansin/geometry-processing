kid[i].off 		shape data
kid[i]_info.txt 	basic information like #vertices and #faces
kid[i]_ref.txt		matching indices of the i-th kid and the null pose, first row i-th kid, second null kid
kid[i]_sym.txt 		symmetry matching on the i-th kid, 0 indicates that no symmetric match exists

- all indices are one-based
- all vertices on the low resolution shapes have a match on the null shape

Please cite the following paper if you are using this data for your research
SHREC’16: Matching of Deformable Shapes with Topological Noise,
Z. Lähner, E. Rodolà, M. M. Bronstein, D. Cremers 2,
O. Burghard, L. Cosmo, A. Dieckmann, R. Klein, Y. Sahillioglu.
In Proc. of Eurographics Workshop on 3D Object Retrieval (3DOR), 2016
