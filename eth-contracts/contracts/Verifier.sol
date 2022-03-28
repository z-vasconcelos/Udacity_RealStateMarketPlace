// This file is MIT Licensed.
//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//pragma solidity ^0.8.0;
//pragma experimental ABIEncoderV2;
pragma solidity >=0.4.21 <0.6.0;

library Pairing {
    struct G1Point {
        uint X;
        uint Y;
    }
    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }

    /// @return the generator of G1
    function P1() pure internal returns (G1Point memory) {
        return G1Point(1, 2);
    }
    /// @return the generator of G2
    function P2() pure internal returns (G2Point memory) {
        return G2Point(
            [10857046999023057135944570762232829481370756359578518086990519993285655852781,
             11559732032986387107991004021392285783925812861821192530917403151452391805634],
            [8495653923123431417604973247489272438418190587263600148770280649306958101930,
             4082367875863433681332203403145435568316851327593401208105741076214120093531]
        );
    }
    /// @return the negation of p, i.e. p.addition(p.negate()) should be zero.
    function negate(G1Point memory p) pure internal returns (G1Point memory) {
        // The prime q in the base field F_q for G1
        uint q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
        if (p.X == 0 && p.Y == 0)
            return G1Point(0, 0);
        return G1Point(p.X, q - (p.Y % q));
    }
    /// @return r the sum of two points of G1
    function addition(G1Point memory p1, G1Point memory p2) internal view returns (G1Point memory r) {
        uint[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
    }


    /// @return r the product of a point on G1 and a scalar, i.e.
    /// p == p.scalar_mul(1) and p.addition(p) == p.scalar_mul(2) for all points p.
    function scalar_mul(G1Point memory p, uint s) internal view returns (G1Point memory r) {
        uint[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require (success);
    }
    /// @return the result of computing the pairing check
    /// e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
    /// For example pairing([P1(), P1().negate()], [P2(), P2()]) should
    /// return true.
    function pairing(G1Point[] memory p1, G2Point[] memory p2) internal view returns (bool) {
        require(p1.length == p2.length);
        uint elements = p1.length;
        uint inputSize = elements * 6;
        uint[] memory input = new uint[](inputSize);
        for (uint i = 0; i < elements; i++)
        {
            input[i * 6 + 0] = p1[i].X;
            input[i * 6 + 1] = p1[i].Y;
            input[i * 6 + 2] = p2[i].X[1];
            input[i * 6 + 3] = p2[i].X[0];
            input[i * 6 + 4] = p2[i].Y[1];
            input[i * 6 + 5] = p2[i].Y[0];
        }
        uint[1] memory out;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 8, add(input, 0x20), mul(inputSize, 0x20), out, 0x20)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
        return out[0] != 0;
    }
    /// Convenience method for a pairing check for two pairs.
    function pairingProd2(G1Point memory a1, G2Point memory a2, G1Point memory b1, G2Point memory b2) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](2);
        G2Point[] memory p2 = new G2Point[](2);
        p1[0] = a1;
        p1[1] = b1;
        p2[0] = a2;
        p2[1] = b2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for three pairs.
    function pairingProd3(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](3);
        G2Point[] memory p2 = new G2Point[](3);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for four pairs.
    function pairingProd4(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2,
            G1Point memory d1, G2Point memory d2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](4);
        G2Point[] memory p2 = new G2Point[](4);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p1[3] = d1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        p2[3] = d2;
        return pairing(p1, p2);
    }
}

contract Verifier {
    using Pairing for *;
    struct VerifyingKey {
        Pairing.G1Point alpha;
        Pairing.G2Point beta;
        Pairing.G2Point gamma;
        Pairing.G2Point delta;
        Pairing.G1Point[] gamma_abc;
    }
    
    //Adapted Proof from
    ////Code from Verifier from this page
    //https://classroom.udacity.com/nanodegrees/nd1309/parts/fa681527-1a61-4757-b8a1-4c6419887878/modules/65842110-9cfb-4fd9-9198-67b181c9cd89/lessons/5146574d-6371-419a-ad2f-27906701bc5b/concepts/81b69f44-8a11-401f-a82e-7e0f96a48ba5
    struct Proof {
        Pairing.G1Point a;
        Pairing.G1Point a_p;
        Pairing.G2Point b;
        Pairing.G1Point b_p;
        Pairing.G1Point c;
        Pairing.G1Point c_p;
        Pairing.G1Point k;
        Pairing.G1Point h;
    }

    event Verified(string message);

    function verifyingKey() pure internal returns (VerifyingKey memory vk) {
        vk.alpha = Pairing.G1Point(uint256(0x2366f514f5076bff334c5d161e6ce11157f6ea1ec173b5133233fbe49b2e6ba3), uint256(0x2b8eb113e2616584f440f229b03863ba098e669d223839a67db233a8cf1571d1));
        vk.beta = Pairing.G2Point([uint256(0x27e4ac1e4fdc1447e8b3c0e9cddfda700a95e3b484bf91a8f2360e2992484ccd), uint256(0x26e51258d4eda3022c38894303ad8e09bbf118bc8e2ec0f6b2426cf7ff5fac80)], [uint256(0x10087ea54acea15d576248545b08c40b101e32f1dfa1e986f272ab5a2f2d0050), uint256(0x1ef9cdb9af1f76bcb98ebe73977c1128d6fd149823122e0bf619c4e0436eb180)]);
        vk.gamma = Pairing.G2Point([uint256(0x0fb772a46155277780cfc630db7fbbf6d422a1e2b6567ba6a28ce9dc9dd0dbc5), uint256(0x21c6742d28873912fb63a80c3fbd972de60385183630bfbc6d47fa18ac602c8e)], [uint256(0x04c09fd0261fee9967756d37024d70739300d86170dd34e370362a0088afed41), uint256(0x1e8e2628dfa208dd4aa59207f0fe912bd54ac2ceecae2f440e89495feacc1574)]);
        vk.delta = Pairing.G2Point([uint256(0x1b75a30e8fdc45859989aae5aadc9e00a2bbe51fc7387fd459f07146b014d6d3), uint256(0x200a8e62ec215877f6e0e998a65108b05e64f53b924aece19c0a69a482f2f4ed)], [uint256(0x1995494a9ec0d126bf34900c9ae2252076cffddc38d6d152b86cea5bc953e892), uint256(0x21eab243631ac4c6f640f58e258a508c0d5fe40eb0ef2b8a554bc45e092f56bb)]);
        vk.gamma_abc = new Pairing.G1Point[](3);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x191a7f9c59e4ade3bfdf8f427e3c6c6e54ccc220e7b5560cd2ce239a5f32dc26), uint256(0x13d22af2f5ee101dbdeb479ba2423847ceb94abffb5b058864d7fde09ed94f7a));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x23668ebb892399f7232f0db72606e80a2d193e5b06bc12fd303488b6df789352), uint256(0x024021d822cfdb683da72cc2d23ecac9c4c8a88c3a98d1deb6fd0e8126e7da98));
        vk.gamma_abc[2] = Pairing.G1Point(uint256(0x16fa7c76102d774b35b633cd019570a261cf918778dd128809a955328438b2a4), uint256(0x269ad80dc6999b7f1c962ff9a04d2542cdad6786e4f0b7147286640fbb54a346));
    }
    function verify(uint[] memory input, Proof memory proof) internal view returns (uint) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.gamma_abc.length);
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            require(input[i] < snark_scalar_field);
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.gamma_abc[i + 1], input[i]));
        }
        vk_x = Pairing.addition(vk_x, vk.gamma_abc[0]);
        if(!Pairing.pairingProd4(
             proof.a, proof.b,
             Pairing.negate(vk_x), vk.gamma,
             Pairing.negate(proof.c), vk.delta,
             Pairing.negate(vk.alpha), vk.beta)) return 1;
        return 0;
    }

    //Replaced this one to simplify solnSquareVerifier and to avoid using experimental abiEncoder
    // function verifyTx( 
    //                     Proof memory proof,
    //                     uint[2] memory input
    //                 )
    //                 public view returns (bool r) {
    //     uint[] memory inputValues = new uint[](2);
        
    //     for(uint i = 0; i < input.length; i++){
    //         inputValues[i] = input[i];
    //     }
    //     if (verify(inputValues, proof) == 0) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    //Code from Verifier from this page
    //https://classroom.udacity.com/nanodegrees/nd1309/parts/fa681527-1a61-4757-b8a1-4c6419887878/modules/65842110-9cfb-4fd9-9198-67b181c9cd89/lessons/5146574d-6371-419a-ad2f-27906701bc5b/concepts/81b69f44-8a11-401f-a82e-7e0f96a48ba5
    function verifyTx(
                        uint[2] memory a,
                        //uint[2] memory a_p,
                        uint[2][2] memory b,
                        //uint[2] memory b_p,
                        uint[2] memory c,
                        //uint[2] memory c_p,
                        //uint[2] memory h,
                        //uint[2] memory k,
                        uint[2] memory input
                        )
                        public
                        returns (bool r) 
        {
            Proof memory proof;
            proof.a = Pairing.G1Point(a[0], a[1]);
            //proof.a_p = Pairing.G1Point(a_p[0], a_p[1]);
            proof.b = Pairing.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]);
            //proof.b_p = Pairing.G1Point(b_p[0], b_p[1]);
            proof.c = Pairing.G1Point(c[0], c[1]);
            //proof.c_p = Pairing.G1Point(c_p[0], c_p[1]);
            //proof.h = Pairing.G1Point(h[0], h[1]);
            //proof.k = Pairing.G1Point(k[0], k[1]);
            uint[] memory inputValues = new uint[](input.length);
            for(uint i = 0; i < input.length; i++){
                inputValues[i] = input[i];
            }
            if (verify(inputValues, proof) == 0) {
                emit Verified("Transaction successfully verified.");
                return true;
            } else {
                return false;
            }
        }
}
