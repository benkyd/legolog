// Looseley based on https://webglfundamentals.org/webgl/lessons/webgl-load-obj.html

// returns verticies, normals and indicies
// (texture coordinates are for nerds)
export default function LoadObj(objText) {
    const lines = objText.split('\n');

    const v = [];
    const vn = [];
    const f = [];
    const fn = [];

    for (const line of lines) {
        const words = line.split(' ');
        if (words[0] === 'v') {
            // verticies
            const x = parseFloat(words[1]);
            const y = parseFloat(words[2]);
            const z = parseFloat(words[3]);
            const vert = [x, y, z];
            v.push(vert);
        } else if (words[0] === 'vn') {
            // normals
            const nx = parseFloat(words[1]);
            const ny = parseFloat(words[2]);
            const nz = parseFloat(words[3]);
            const n = [nx, ny, nz];
            vn.push(n);
        } else if (words[0] === 'f') {
            // indicies
            const pos = [];
            const nor = [];
            for (let i = 1; i < words.length; i++) {
                const face = words[i].split('//');
                const v = parseInt(face[0]);
                const n = parseInt(face[1]);
                pos.push(v);
                nor.push(n);
            }
            f.push(pos);
            fn.push(nor);
        }
    }

    return {
        vertices: v,
        normals: vn,
        indices: f,
        normalIndicies: fn,
    };
}
