const core = require('@actions/core');
const path = require('path');
const fs = require('fs');

try {
    const scratchGuiDir = core.getInput('scratch-gui-dir', { required: true });
    console.log(`scratch-gui-dir: '${scratchGuiDir}'`);

    const logoFile = core.getInput('logo-file');
    if (logoFile) {
        console.log(`logo-file: '${logoFile}'`);
        const dest = path.join(scratchGuiDir, 'src/components/menu-bar/scratch-logo.svg');
        fs.copyFileSync(logoFile, dest);
    }

    const homeUrl = core.getInput('home-url');
    if (homeUrl) {
        console.log(`home-url: '${homeUrl}'`);
        const filePath = path.join(scratchGuiDir, 'src/playground/render-gui.jsx');
        let code = fs.readFileSync(filePath, 'utf-8');
        code = code.replace(/https:\/\/scratch.mit.edu/, homeUrl);
        fs.writeFileSync(filePath, code);
    }

    const title = core.getInput('title');
    if (title) {
        console.log(`title: '${title}'`);
        const filePath = path.join(scratchGuiDir, 'webpack.config.js');
        let code = fs.readFileSync(filePath, 'utf-8');
        code = code.replace(/Scratch 3.0 GUI/g, title);
        fs.writeFileSync(filePath, code);
    }
} catch (error) {
    core.setFailed(error.message);
}
