const core = require('@actions/core');
const path = require('path');
const fs = require('fs');

function removeTrademarkedCostumes(scratchGuiDir) {
    const trademarkNames = [
        'Cat',
        'Cat Flying',
        'Giga',
        'Giga Walking',
        'Gobo',
        'Nano',
        'Pico',
        'Pico Walking',
        'Tera'
    ];

    let assetIds = [];
    let filteredSprites = [];

    const spritesJsonPath = path.join(scratchGuiDir, 'src/lib/libraries/sprites.json');
    const sprites = JSON.parse(fs.readFileSync(spritesJsonPath, 'utf-8'));
    sprites.forEach(sprite => {
        if (trademarkNames.includes(sprite.name)) {
            assetIds.push(...sprite.costumes.map(e => e.assetId));
        } else {
            filteredSprites.push(sprite);
        }
    });
    fs.writeFileSync(spritesJsonPath, JSON.stringify(filteredSprites, null, 4));

    const costumesJsonPath = path.join(scratchGuiDir, 'src/lib/libraries/costumes.json');
    const costumes = JSON.parse(fs.readFileSync(costumesJsonPath, 'utf-8'));
    const filteredCostumes = costumes.filter(e => !assetIds.includes(e.assetId));
    fs.writeFileSync(costumesJsonPath, JSON.stringify(filteredCostumes, null, 4));
}

try {
    const scratchGuiDir = core.getInput('scratch-gui-dir', { required: true });
    console.log(`scratch-gui-dir: ${scratchGuiDir}`);

    const logoFile = core.getInput('logo-file');
    if (logoFile) {
        console.log(`logo-file: '${logoFile}'`);
        const dest = path.join(scratchGuiDir, 'src/components/menu-bar/scratch-logo.svg');
        fs.copyFileSync(logoFile, dest);
    }

    const homeUrl = core.getInput('home-url');
    if (homeUrl) {
        console.log(`home-url: ${homeUrl}`);
        const filePath = path.join(scratchGuiDir, 'src/playground/render-gui.jsx');
        let code = fs.readFileSync(filePath, 'utf-8');
        code = code.replace(/https:\/\/scratch.mit.edu/, homeUrl);
        fs.writeFileSync(filePath, code);
    }

    const title = core.getInput('title');
    if (title) {
        console.log(`title: ${title}`);
        const filePath = path.join(scratchGuiDir, 'webpack.config.js');
        let code = fs.readFileSync(filePath, 'utf-8');
        code = code.replace(/Scratch 3.0 GUI/g, title);
        fs.writeFileSync(filePath, code);
    }

    const hideComingSoon = core.getBooleanInput('hide-coming-soon');
    if (hideComingSoon) {
        console.log(`hide-coming-soon: ${hideComingSoon}`);
        const filePath = path.join(scratchGuiDir, 'src/playground/render-gui.jsx');
        let code = fs.readFileSync(filePath, 'utf-8');
        code = code.replace(/^\s*showComingSoon\n/gm, '');
        fs.writeFileSync(filePath, code);
    }

    const hideBackpack = core.getBooleanInput('hide-backpack');
    if (hideBackpack) {
        console.log(`hide-backpack: ${hideBackpack}`);
        const filePath = path.join(scratchGuiDir, 'src/playground/render-gui.jsx');
        let code = fs.readFileSync(filePath, 'utf-8');
        code = code.replace(/^\s*backpackVisible\n/gm, '');
        fs.writeFileSync(filePath, code);
    }
} catch (error) {
    core.setFailed(error.message);
}
