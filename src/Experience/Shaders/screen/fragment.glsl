#pragma glslify: cnoise3 = require('glsl-noise/classic/3d.glsl')

varying vec2 vUv;
varying vec3 vpos;

uniform float uTime;
uniform float uBrightness;

void main () {
    /* gl_FragColor = vec4(vUv, cos(uTime * 2.05), 1.0); */
    /* vec3 r = vec3(1.0, 0.5, 4.0); */
    /* vec2 displacedUv = vUv + cnoise3(vec3(vUv * 7.0, uTime * 0.1)); */
    /* float strength = cnoise3(vec3(displacedUv * 5.0, uTime * 0.2)); */

    vec3 color = mix(vec3(0.1, 0.1, 0.1), vec3(1.0, 1.0, 1.0), uBrightness);
    gl_FragColor = vec4(color, uBrightness);
}
