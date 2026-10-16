import sharp from 'sharp'; import fs from 'fs'; import path from 'path';
const src = process.argv[2], out = process.argv[3];
fs.mkdirSync(out,{recursive:true});
for (const d of fs.readdirSync(src).filter(f=>fs.statSync(path.join(src,f)).isDirectory())) {
  const files = fs.readdirSync(path.join(src,d)).filter(f=>/\.(png|jpe?g)$/i.test(f)).sort();
  const tiles = await Promise.all(files.map(async f=>({f, buf: await sharp(path.join(src,d,f)).resize(360,360,{fit:'contain',background:'#888'}).png().toBuffer()})));
  const cols=5, rows=Math.ceil(tiles.length/cols);
  await sharp({create:{width:cols*370,height:rows*370,channels:3,background:'#fff'}})
   .composite(tiles.map((t,i)=>({input:t.buf,left:(i%cols)*370+5,top:Math.floor(i/cols)*370+5}))).jpeg({quality:70}).toFile(path.join(out,d.slice(0,2)+'.jpg'));
  console.log(d, files.join(','));
}
