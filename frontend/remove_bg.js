import Jimp from 'jimp';

async function removeWhite() {
    try {
        const image = await Jimp.read(process.argv[2]);
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            // If pixel is mostly white
            if (r > 240 && g > 240 && b > 240) {
                this.bitmap.data[idx + 3] = 0; // Transparent alpha
            }
        });
        await image.writeAsync(process.argv[3]);
        console.log("Background removed successfully!");
    } catch (err) {
        console.error(err);
    }
}

removeWhite();
