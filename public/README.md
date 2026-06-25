# public/

Asset statici serviti alla radice del sito.

## logo.png

Navbar e Footer referenziano `/logo.png` tramite `next/image`.
Caricare qui manualmente il file `logo.png` (sfondo trasparente consigliato).

- Navbar: renderizzato a 32px di altezza (`h-8 w-auto`)
- Footer: renderizzato a 28px di altezza (`h-7 w-auto`)

Finché il file non è presente l'immagine restituirà 404, ma il layout
è già predisposto.
