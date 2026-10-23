// ponytail: satu cek runnable, tidak ada framework.
// Jalankan: node --experimental-strip-types src/data/bonkuData.check.ts
import {
  profileData,
  productsData,
  marketingData,
  orderStepsData,
  techStackData,
  experienceData,
  projectsData
} from './bonkuData.ts';

const assert = (cond: unknown, msg: string) => {
  if (!cond) throw new Error(msg);
};

// 1. alias harus menunjuk ke data yang sama (komponen lama masih pakai nama lama)
assert(techStackData === marketingData, 'techStackData bukan alias marketingData');
assert(experienceData === orderStepsData, 'experienceData bukan alias orderStepsData');
assert(projectsData === productsData, 'projectsData bukan alias productsData');
assert(techStackData.length === 12, 'jumlah aspek marketing berubah: ' + techStackData.length);
assert(orderStepsData.length === 4, 'jumlah langkah pemesanan berubah: ' + orderStepsData.length);

// 2. kategori produk harus cocok dengan tipe ProjectCategory
for (const p of productsData) {
  assert(['abon', 'roti'].includes(p.category), `kategori produk tidak valid: ${p.category}`);
  assert(p.orderUrl?.startsWith('https://wa.me/'), `orderUrl bukan link WA: ${p.id}`);
  assert(p.orderUrl?.includes('6282338929138'), `nomor WA di orderUrl salah: ${p.orderUrl}`);
}

// 3. layer aspek harus cocok dengan MarketingLayer
for (const m of marketingData) {
  assert(['product', 'price', 'place', 'promotion'].includes(m.layer), `layer invalid: ${m.layer}`);
  assert(m.category === m.layer, `category != layer di ${m.name}`);
}

// 4. turunan link WhatsApp dari nomor yang ditampilkan (dipakai ContactSection)
const derived = `https://wa.me/${profileData.contact.whatsapp.replace(/\D/g, '').replace(/^0/, '62')}`;
assert(derived === 'https://wa.me/6282338929138', 'derivasi nomor WA salah: ' + derived);
assert(
  profileData.contact.whatsappLink.startsWith('https://wa.me/6282338929138'),
  'whatsappLink tidak sinkron dengan nomor: ' + profileData.contact.whatsappLink
);

// 5. setiap productLinks mengarah ke produk yang benar-benar ada
const ids = new Set(productsData.map((p) => p.id));
for (const m of marketingData) {
  for (const id of m.productLinks ?? []) {
    assert(ids.has(id), `productLinks merujuk produk hilang: ${id} (dari ${m.name})`);
  }
}

console.log('OK: cek data BonKu lulus (' + productsData.length + ' produk, ' + marketingData.length + ' aspek)');