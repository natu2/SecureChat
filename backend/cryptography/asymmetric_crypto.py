from collections import defaultdict;

from cryptography.hazmat.primitives.asymmetric import ec

asymmetric_keys = defaultdict(str) #username ==> (public key, private key)