export default [
    {
        name: "base",
        data: {},
        items: [
            {
                name: "deskTexture",
                source: "/assets/baked.jpg",
                type: "texture",
            },
            { name: "desk", source: "/assets/portfolio.glb" },
            { name: "coffee", source: "/bakedModel.glb" },
            // add loader for this
            // { name: "clickSound", souce: "/assets/sounds/click.wav", type: "sound" },
        ],
    },
] as const;
