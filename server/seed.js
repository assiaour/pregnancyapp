/**
 * Seed script for pregnancy app database
 * Run: node server/seed.js
 * Requires: MONGODB_URI in .env (or defaults to localhost)
 */
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pregnancy-app';

const weekSchema = new mongoose.Schema({
  week: { type: Number, required: true, unique: true },
  size_cm: Number,
  weight_g: Number,
  fruit: String,
  development: String,
  image: String,
}, { timestamps: true });

const tipSchema = new mongoose.Schema({
  text: String,
  dayOfYear: Number,
}, { timestamps: true });

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  week: Number,
  image: String,
  source: String,
}, { timestamps: true });

const Week = mongoose.model('Week', weekSchema);
const Tip = mongoose.model('Tip', tipSchema);
const Article = mongoose.model('Article', articleSchema);

const WEEKS_DATA = [
  { week: 1, fruit: 'Graine de pavot', size_cm: 0.1, weight_g: 0, development: 'La fécondation a lieu. L\'ovule fécondé voyage vers l\'utérus.', image: '4-weeks-poppy-seeds_4x3.jpg' },
  { week: 2, fruit: 'Graine de pavot', size_cm: 0.2, weight_g: 0, development: 'Le blastocyste s\'implante dans la paroi utérine.', image: '4-weeks-poppy-seeds_4x3.jpg' },
  { week: 3, fruit: 'Graine de pavot', size_cm: 0.2, weight_g: 0, development: 'Le tube neural commence à se former. Le cœur commence à se développer.', image: '4-weeks-poppy-seeds_4x3.jpg' },
  { week: 4, fruit: 'Graine de pavot', size_cm: 0.2, weight_g: 0, development: 'Le bébé a la taille d\'une graine de pavot. Le placenta commence à se former.', image: '4-weeks-poppy-seeds_4x3.jpg' },
  { week: 5, fruit: 'Graine de sésame', size_cm: 0.3, weight_g: 0, development: 'Le cœur bat. Le cerveau et la moelle épinière commencent à se développer.', image: '5-weeks-sesame-seeds_4x3.jpg' },
  { week: 6, fruit: 'Lentille', size_cm: 0.6, weight_g: 0, development: 'Les traits du visage se forment. Les bourgeons des bras et des jambes apparaissent.', image: '6-weeks-lentils_4x3.jpg' },
  { week: 7, fruit: 'Myrtille', size_cm: 1, weight_g: 0, development: 'Le bébé double de volume. Les reins se développent.', image: '7-weeks-blueberry_4x3.jpg' },
  { week: 8, fruit: 'Framboise', size_cm: 1.6, weight_g: 1, development: 'Les doigts et les orteils se forment. Tous les organes principaux se développent.', image: '8-weeks-raspberry_4x3.jpg' },
  { week: 9, fruit: 'Raisin', size_cm: 2.3, weight_g: 2, development: 'Le bébé peut serrer les poings. La queue disparaît.', image: '9-weeks-grape_4x3.jpg' },
  { week: 10, fruit: 'Fraise', size_cm: 3.1, weight_g: 4, development: 'Les bourgeons dentaires se forment. Les os commencent à durcir.', image: '10-weeks-strawberry_4x3.jpg' },
  { week: 11, fruit: 'Figue', size_cm: 4.1, weight_g: 7, development: 'Le bébé est presque entièrement formé. Les organes génitaux se développent.', image: '11-weeks-fig_4x3.jpg' },
  { week: 12, fruit: 'Citron vert', size_cm: 5.4, weight_g: 14, development: 'Les réflexes se développent. Le bébé peut avaler.', image: '12-weeks-lime_4x3.jpg' },
  { week: 13, fruit: 'Prune', size_cm: 7.4, weight_g: 23, development: 'Premier trimestre terminé. Les empreintes digitales se forment.', image: '13-weeks-plum_4x3.jpg' },
  { week: 14, fruit: 'Citron', size_cm: 8.7, weight_g: 43, development: 'Le bébé peut faire des expressions faciales. Les cheveux commencent à pousser.', image: '15-weeks-lemon_4x3.jpg' },
  { week: 15, fruit: 'Pomme', size_cm: 10.1, weight_g: 70, development: 'Les os se renforcent. Le bébé peut percevoir la lumière.', image: '16-weeks-apple_4x3.jpg' },
  { week: 16, fruit: 'Avocat', size_cm: 11.6, weight_g: 100, development: 'L\'ouïe se développe. Le bébé peut entendre votre voix.', image: '17-weeks-avocado_4x3.jpg' },
  { week: 17, fruit: 'Navet', size_cm: 13, weight_g: 140, development: 'Les réserves de graisse commencent. Le cordon ombilical se renforce.', image: '18-weeks-turnip_4x3.jpg' },
  { week: 18, fruit: 'Poivron', size_cm: 14.2, weight_g: 190, development: 'Le bébé est très actif. Vous pourrez bientôt sentir ses mouvements.', image: '18-weeks-bellpepper_4x3.jpg' },
  { week: 19, fruit: 'Grenade', size_cm: 15.3, weight_g: 240, development: 'Le vernix protège la peau. Le bébé s\'entraîne à avaler.', image: '19-weeks-pomegranate_4x3.jpg' },
  { week: 20, fruit: 'Banane', size_cm: 25.6, weight_g: 300, development: 'À mi-chemin ! Le bébé est à la moitié de son développement.', image: '20-weeks-banana_4x3.jpg' },
  { week: 21, fruit: 'Mangue', size_cm: 26.7, weight_g: 360, development: 'Le système digestif se prépare. Le bébé peut goûter le liquide amniotique.', image: '21-weeks-mango_4x3.jpg' },
  { week: 22, fruit: 'Patate douce', size_cm: 27.9, weight_g: 430, development: 'Les paupières et les sourcils se forment. Le bébé s\'entraîne à respirer.', image: '22-weeks-sweet-potato_4x3.jpg' },
  { week: 23, fruit: 'Pamplemousse', size_cm: 28.9, weight_g: 501, development: 'Croissance rapide du cerveau. Le bébé peut entendre des sons.', image: '23-weeks-grapefruit_4x3.jpg' },
  { week: 24, fruit: 'Épi de maïs', size_cm: 30, weight_g: 600, development: 'Les poumons se développent. Le bébé pourrait survivre avec des soins s\'il naissait maintenant.', image: '24-weeks-corn_4x3.jpg' },
  { week: 25, fruit: 'Courge poivrée', size_cm: 34.6, weight_g: 660, development: 'Les mains sont complètement développées. Le bébé réagit au toucher.', image: '25-weeks-acorn-squash_4x3.jpg' },
  { week: 26, fruit: 'Courge spaghetti', size_cm: 35.6, weight_g: 760, development: 'Les yeux se forment. Le bébé peut ouvrir les yeux.', image: '26-weeks-spaghetti-squash_4x3.jpg' },
  { week: 27, fruit: 'Chou-fleur', size_cm: 36.6, weight_g: 875, development: 'Le cerveau grandit rapidement. Les cycles de sommeil se développent.', image: '27-weeks-cauliflower_4x3.jpg' },
  { week: 28, fruit: 'Aubergine', size_cm: 37.6, weight_g: 1005, development: 'Le troisième trimestre commence. Les poumons se développent.', image: '28-weeks-eggplant_4x3.jpg' },
  { week: 29, fruit: 'Courge musquée', size_cm: 38.6, weight_g: 1153, development: 'Les muscles et les poumons maturent. Le bébé peut réguler sa température.', image: '29-weeks-butternut-squash_4x3.jpg' },
  { week: 30, fruit: 'Chou', size_cm: 39.9, weight_g: 1319, development: 'Le bébé s\'arrondit. Les yeux peuvent s\'ouvrir et se fermer.', image: '30-weeks-cabbage_4x3.jpg' },
  { week: 31, fruit: 'Noix de coco', size_cm: 41.1, weight_g: 1502, development: 'Le bébé traite les informations. Les cinq sens fonctionnent.', image: '31-weeks-coconut_4x3.jpg' },
  { week: 32, fruit: 'Papaye', size_cm: 42.4, weight_g: 1702, development: 'Le bébé s\'entraîne à respirer. La peau devient lisse.', image: '32-weeks-papaya_4x3.jpg' },
  { week: 33, fruit: 'Ananas', size_cm: 43.7, weight_g: 1918, development: 'Les os durcissent. Le bébé peut distinguer le jour de la nuit.', image: '33-weeks-pineapple_4x3.jpg' },
  { week: 34, fruit: 'Cantaloup', size_cm: 45, weight_g: 2146, development: 'Les poumons sont presque matures. Le bébé peut reconnaître des chansons.', image: '34-weeks-cantaloupe_4x3.jpg' },
  { week: 35, fruit: 'Melon miel', size_cm: 46.2, weight_g: 2383, development: 'Les reins sont complètement développés. Le bébé prend du poids.', image: '35-weeks-honeydew-melon_4x3.jpg' },
  { week: 36, fruit: 'Laitue', size_cm: 47.4, weight_g: 2622, development: 'Le bébé est presque prêt. Les poumons sont matures.', image: '36-weeks-lettuce_4x3.jpg' },
  { week: 37, fruit: 'Blette', size_cm: 48.6, weight_g: 2859, development: 'À terme ! Le bébé peut arriver à tout moment.', image: '37-weeks-swiss-chard_4x3.jpg' },
  { week: 38, fruit: 'Mini pastèque', size_cm: 49.8, weight_g: 3083, development: 'Le bébé est complètement développé. Il se prépare pour la naissance.', image: '38-weeks-mini-watermelon_4x3.jpg' },
  { week: 39, fruit: 'Citrouille', size_cm: 50.7, weight_g: 3288, development: 'Le bébé est prêt. Derniers préparatifs.', image: '39-weeks-pumpkin_4x3.jpg' },
  { week: 40, fruit: 'Pastèque', size_cm: 51.2, weight_g: 3462, development: 'Date prévue ! Le bébé est complètement développé et prêt à vous rencontrer.', image: '40-weeks-watermelon_4x3.jpg' },
];

const TIPS_DATA = [
  'Buvez beaucoup d\'eau aujourd\'hui. L\'hydratation aide à prévenir les maux de tête pendant la grossesse.',
  'Faites de courtes promenades. Un exercice doux peut améliorer votre humeur et votre niveau d\'énergie.',
  'Mangez de petits repas fréquents pour aider à soulager les nausées et les brûlures d\'estomac.',
  'Reposez-vous suffisamment. Votre corps travaille dur pour faire grandir votre bébé.',
  'Prenez vos vitamines prénatales tous les jours. Elles soutiennent le développement de bébé.',
  'Évitez les aliments crus ou insuffisamment cuits. La sécurité alimentaire est très importante en ce moment.',
  'Restez active avec du yoga prénatal ou de la natation si votre médecin l\'approuve.',
  'Pratiquez la respiration profonde. Cela aide à gérer le stress et prépare à l\'accouchement.',
  'Mangez des aliments riches en fer comme les épinards et les viandes maigres pour prévenir l\'anémie.',
  'Évitez de rester debout pendant de longues périodes. Faites des pauses et surélevez vos pieds.',
  'Restez connectée avec votre partenaire. Partagez vos sentiments et vos pensées.',
  'Limitez la caféine. Restez en dessous de 200 mg par jour.',
  'Portez des chaussures confortables. Vos pieds peuvent gonfler pendant la grossesse.',
  'Dormez sur le côté gauche lorsque c\'est possible. Cela améliore la circulation sanguine.',
  'Participez à des cours de préparation à la naissance pour vous préparer à l\'accouchement et à la parentalité.',
  'Écoutez votre corps. Reposez-vous quand vous en ressentez le besoin.',
  'Mangez des aliments riches en fibres pour prévenir la constipation.',
  'Appliquez de la crème solaire. La grossesse peut rendre la peau plus sensible.',
  'Évitez les bains à remous et les saunas. Ils peuvent augmenter la température corporelle.',
  'Préparez votre valise pour la maternité à l\'approche de votre date d\'accouchement.',
];

const ARTICLES_DATA = [
  { title: 'Aliments à éviter pendant la grossesse', content: 'Pendant la grossesse, évitez la viande, les œufs et le poisson crus ou insuffisamment cuits. Les produits laitiers non pasteurisés et la charcuterie peuvent abriter des bactéries nocives. Limitez votre consommation de caféine et évitez complètement l\'alcool. Certains poissons riches en mercure (comme l\'espadon) doivent être évités. Lavez toujours soigneusement les fruits et légumes.', category: 'Nutrition', source: 'Example Source' },
  { title: 'Gérer les nausées matinales', content: 'Les nausées matinales affectent de nombreuses femmes enceintes. Mangez de petits repas fréquents tout au long de la journée. Évitez d\'avoir l\'estomac vide. Le gingembre, les craquelins et les aliments froids aident souvent. Restez hydratée. Si les symptômes sont sévères, consultez votre médecin concernant des médicaments sûrs.', category: 'Symptômes', source: 'Example Source' },
  { title: 'Premier trimestre : Semaines 1-12', content: 'Le premier trimestre est une période de développement rapide. Les principaux organes et structures de votre bébé se forment. Vous pouvez ressentir de la fatigue, des nausées et une sensibilité des seins. Assistez à votre premier rendez-vous prénatal. Prenez de l\'acide folique et évitez les substances nocives.', category: 'Développement du bébé', source: 'Example Source' },
  { title: 'Deuxième trimestre : Semaines 13-27', content: 'Beaucoup de femmes se sentent en pleine forme pendant le deuxième trimestre. Vous pourriez sentir votre bébé bouger pour la première fois. L\'énergie revient souvent. Votre ventre devient visible. C\'est le bon moment pour les cours prénataux et la préparation de votre maison.', category: 'Développement du bébé', source: 'Example Source' },
  { title: 'Troisième trimestre : Semaines 28-40', content: 'Votre bébé grandit rapidement pendant le troisième trimestre. Vous pourriez ressentir plus d\'inconfort à l\'approche de votre date d\'accouchement. Pratiquez des techniques de respiration et de relaxation. Préparez votre valise de maternité. Surveillez les signes de travail.', category: 'Développement du bébé', source: 'Example Source' },
  { title: 'Grossesse et exercice', content: 'L\'exercice pendant la grossesse est généralement sûr et bénéfique. La marche, la natation et le yoga prénatal sont d\'excellents choix. Évitez les sports de contact et les activités à haut risque de chute. Écoutez votre corps et restez hydratée. Consultez votre médecin avant de commencer tout programme d\'exercice.', category: 'Exercice', source: 'Example Source' },
  { title: 'Santé mentale pendant la grossesse', content: 'La grossesse peut apporter un mélange d\'émotions. L\'anxiété et les changements d\'humeur sont courants. Parlez-en à votre partenaire, à vos amis ou à un professionnel de la santé. Le repos et prendre soin de soi sont importants. Si vous vous sentez constamment triste ou anxieuse, demandez de l\'aide. Vous n\'êtes pas seule.', category: 'Santé mentale', source: 'Example Source' },
  { title: 'Guide des vitamines prénatales', content: 'Les vitamines prénatales fournissent des nutriments essentiels comme l\'acide folique, le fer et le calcium. L\'acide folique aide à prévenir les anomalies du tube neural. Le fer soutient le volume sanguin. Commencez à les prendre avant la conception si possible. Prenez-les avec de la nourriture pour réduire les nausées.', category: 'Nutrition', source: 'Example Source' },
  { title: 'Symptômes de grossesse courants', content: 'Les symptômes courants incluent la fatigue, les nausées, les brûlures d\'estomac, les maux de dos et les gonflements. La plupart sont normaux et gérables. Suivez vos symptômes et discutez-en avec votre prestataire de soins. Certains symptômes nécessitent une attention rapide.', category: 'Symptômes', source: 'Example Source' },
  { title: 'Quand appeler votre médecin', content: 'Appelez votre médecin si vous ressentez de fortes douleurs abdominales, des saignements, de graves maux de tête, des changements de vision, un gonflement soudain ou une diminution des mouvements fœtaux. Faites confiance à votre instinct. Il vaut toujours mieux demander.', category: 'Santé', source: 'Example Source' },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  await Week.deleteMany({});
  await Week.insertMany(WEEKS_DATA);
  console.log(`Seeded ${WEEKS_DATA.length} weeks`);

  await Tip.deleteMany({});
  const tips = TIPS_DATA.map((text, i) => ({ text, dayOfYear: i }));
  await Tip.insertMany(tips);
  console.log(`Seeded ${tips.length} tips`);

  await Article.deleteMany({});
  await Article.insertMany(ARTICLES_DATA);
  console.log(`Seeded ${ARTICLES_DATA.length} articles`);

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});