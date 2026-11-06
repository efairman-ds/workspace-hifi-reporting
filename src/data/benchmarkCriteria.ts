// Dummy criteria catalogue for the "Create benchmark" flow — kept
// separate from the flyout's UI components. Each entry carries a
// deliberately spread-out dummy `firstSeen` date (the custom date-range
// filter needs something real to filter against) and a globally unique
// id, since a benchmark can mix items from different categories and
// selection state is tracked as one flat set of ids across all of them.

export type CriteriaCategory = 'competitors' | 'drugs' | 'diseases' | 'publication_type';

export interface CriteriaItem {
  id: string;
  name: string;
  category: CriteriaCategory;
  firstSeen: string; // ISO date — publication data is available from 2010-01-01
  /** Present only on a parent item that has nested subcategories (e.g.
   *  "NHS" → its four nations) — see the "Hierarchical benchmark
   *  structure" section of the brief. Absent on every other item. */
  children?: CriteriaItem[];
}

export const CRITERIA_CATEGORIES: { id: CriteriaCategory; label: string }[] = [
  { id: 'competitors', label: 'Competitors' },
  { id: 'drugs', label: 'Drugs' },
  { id: 'diseases', label: 'Diseases' },
  { id: 'publication_type', label: 'Publication type' },
];

const COMPETITORS = [
  'AbbVie', 'Amgen', 'Astellas Pharma', 'AstraZeneca', 'Bayer', 'BioNTech', 'Biogen', 'Boehringer Ingelheim',
  'Bristol Myers Squibb', 'Chugai Pharmaceutical', 'CSL', 'Daiichi Sankyo', 'Eli Lilly', 'Gilead Sciences', 'GSK',
  'Johnson & Johnson', 'Merck & Co. (MSD)', 'Novartis', 'Novo Nordisk', 'Pfizer', 'Roche', 'Sanofi', 'Takeda',
  'Teva Pharmaceutical Industries', 'Vertex Pharmaceuticals', 'Regeneron', 'Moderna', 'Alnylam Pharmaceuticals',
  'BeiGene', 'Incyte', 'Jazz Pharmaceuticals', 'Ionis Pharmaceuticals', 'Seagen', 'Exelixis', 'Blueprint Medicines',
  'Karyopharm Therapeutics', 'Agios Pharmaceuticals', 'Mirati Therapeutics', 'Genmab', 'argenx', 'UCB', 'Ipsen',
  'Servier', 'Almirall', 'Grifols', 'Fresenius Kabi', 'Otsuka Pharmaceutical', 'Eisai', 'Kyowa Kirin',
  'Ono Pharmaceutical', 'Sumitomo Pharma', 'Shionogi', 'Mitsubishi Tanabe Pharma', 'Sun Pharmaceutical',
  "Dr. Reddy's Laboratories", 'Cipla', 'Lupin', 'Aurobindo Pharma', 'Zydus Lifesciences', 'Biocon',
  'Jiangsu Hengrui Medicine', 'WuXi Biologics', 'Innovent Biologics', 'Junshi Biosciences', 'Legend Biotech',
  'Akeso', 'CStone Pharmaceuticals', 'Zai Lab', 'CanSino Biologics', 'Samsung Bioepis', 'Celltrion',
  'SK Biopharmaceuticals', 'Hanmi Pharmaceutical', 'Yuhan Corporation', 'LG Chem Life Sciences', 'CSL Behring',
  'Merck KGaA', 'Bausch Health', 'Catalent', 'Lonza', 'Recordati', 'Chiesi Farmaceutici', 'Menarini Group',
  'Grünenthal', 'Stada Arzneimittel', 'Zentiva', 'Krka', 'Gedeon Richter', 'Mallinckrodt', 'Endo International',
  'Amneal Pharmaceuticals', 'Viatris', 'Organon', 'Alkermes', 'Supernus Pharmaceuticals', 'Horizon Therapeutics',
  'Neurocrine Biosciences', 'Sarepta Therapeutics', 'Alexion Pharmaceuticals', 'Ultragenyx Pharmaceutical',
  'bluebird bio', 'CRISPR Therapeutics', 'Editas Medicine', 'Intellia Therapeutics', 'Beam Therapeutics',
  'Sana Biotechnology', 'Relay Therapeutics', 'Arvinas', 'Mersana Therapeutics', 'MacroGenics', 'Xencor',
  'Zymeworks', 'Compugen',
];

const DRUGS = [
  'Pembrolizumab', 'Nivolumab', 'Dabrafenib', 'Trametinib', 'Osimertinib', 'Durvalumab', 'Atezolizumab',
  'Ipilimumab', 'Cemiplimab', 'Avelumab', 'Encorafenib', 'Binimetinib', 'Vemurafenib', 'Cobimetinib', 'Erlotinib',
  'Gefitinib', 'Afatinib', 'Crizotinib', 'Alectinib', 'Brigatinib', 'Lorlatinib', 'Ceritinib', 'Entrectinib',
  'Larotrectinib', 'Selpercatinib', 'Pralsetinib', 'Capmatinib', 'Tepotinib', 'Sotorasib', 'Adagrasib', 'Olaparib',
  'Niraparib', 'Rucaparib', 'Talazoparib', 'Palbociclib', 'Ribociclib', 'Abemaciclib', 'Everolimus', 'Temsirolimus',
  'Bevacizumab', 'Ramucirumab', 'Trastuzumab', 'Pertuzumab', 'Trastuzumab emtansine', 'Trastuzumab deruxtecan',
  'Sacituzumab govitecan', 'Enfortumab vedotin', 'Polatuzumab vedotin', 'Brentuximab vedotin',
  'Gemtuzumab ozogamicin', 'Inotuzumab ozogamicin', 'Rituximab', 'Obinutuzumab', 'Ofatumumab', 'Daratumumab',
  'Elotuzumab', 'Isatuximab', 'Blinatumomab', 'Tisagenlecleucel', 'Axicabtagene ciloleucel',
  'Lisocabtagene maraleucel', 'Idecabtagene vicleucel', 'Ciltacabtagene autoleucel', 'Venetoclax', 'Ibrutinib',
  'Acalabrutinib', 'Zanubrutinib', 'Idelalisib', 'Duvelisib', 'Copanlisib', 'Alpelisib', 'Umbralisib',
  'Midostaurin', 'Gilteritinib', 'Enasidenib', 'Ivosidenib', 'Azacitidine', 'Decitabine', 'Lenalidomide',
  'Pomalidomide', 'Thalidomide', 'Bortezomib', 'Carfilzomib', 'Ixazomib', 'Panobinostat', 'Vorinostat',
  'Romidepsin', 'Belinostat', 'Nilotinib', 'Dasatinib', 'Bosutinib', 'Ponatinib', 'Asciminib', 'Imatinib',
  'Sunitinib', 'Sorafenib', 'Pazopanib', 'Axitinib', 'Cabozantinib', 'Lenvatinib', 'Regorafenib', 'Vandetanib',
  'Ripretinib', 'Avapritinib', 'Tucatinib', 'Neratinib', 'Margetuximab', 'Mirvetuximab soravtansine',
];

const DISEASES = [
  'Non-small cell lung cancer', 'Small cell lung cancer', 'Melanoma', 'Breast cancer (HR+/HER2-)',
  'Triple-negative breast cancer', 'HER2-positive breast cancer', 'Colorectal cancer', 'Prostate cancer',
  'Renal cell carcinoma', 'Hepatocellular carcinoma', 'Pancreatic cancer', 'Gastric cancer', 'Esophageal cancer',
  'Ovarian cancer', 'Cervical cancer', 'Endometrial cancer', 'Bladder cancer', 'Urothelial carcinoma',
  'Head and neck squamous cell carcinoma', 'Multiple myeloma', 'Chronic lymphocytic leukemia',
  'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Chronic myeloid leukemia',
  'Diffuse large B-cell lymphoma', 'Follicular lymphoma', 'Mantle cell lymphoma', 'Hodgkin lymphoma',
  'Myelodysplastic syndrome', 'Glioblastoma', 'Low-grade glioma', 'Medulloblastoma', 'Neuroblastoma',
  'Osteosarcoma', 'Ewing sarcoma', 'Soft tissue sarcoma', 'Gastrointestinal stromal tumor', 'Mesothelioma',
  'Thyroid cancer', 'Adrenocortical carcinoma', 'Cholangiocarcinoma', 'Gallbladder cancer', 'Anal cancer',
  'Vulvar cancer', 'Testicular cancer', 'Penile cancer', 'Merkel cell carcinoma',
  'Cutaneous squamous cell carcinoma', 'Basal cell carcinoma', 'Uveal melanoma', 'Retinoblastoma', 'Wilms tumor',
  'Rhabdomyosarcoma', 'Desmoid tumor', 'Chordoma', 'Appendiceal cancer', 'Small bowel cancer',
  'Peritoneal mesothelioma', 'Nasopharyngeal carcinoma', 'Salivary gland cancer', 'Vaginal cancer',
  'Fallopian tube cancer', 'Primary peritoneal cancer', 'Myelofibrosis', 'Polycythemia vera',
  'Essential thrombocythemia', 'Systemic mastocytosis', 'Waldenström macroglobulinemia',
  'Light chain amyloidosis', 'Castleman disease', 'Langerhans cell histiocytosis',
  'Chronic obstructive pulmonary disease', 'Asthma', 'Multiple sclerosis', 'Rheumatoid arthritis', 'Psoriasis',
  'Psoriatic arthritis', 'Ankylosing spondylitis', 'Systemic lupus erythematosus', "Crohn's disease",
  'Ulcerative colitis', 'Type 2 diabetes', 'Chronic kidney disease', 'Heart failure', 'Atrial fibrillation',
  'Hypertension', 'Hyperlipidemia', "Alzheimer's disease", "Parkinson's disease", 'Epilepsy', 'Migraine',
  'Major depressive disorder', 'Schizophrenia', 'Bipolar disorder', 'HIV/AIDS', 'Hepatitis B', 'Hepatitis C',
  'Tuberculosis', 'Cystic fibrosis', 'Duchenne muscular dystrophy', 'Spinal muscular atrophy',
  'Amyotrophic lateral sclerosis', "Huntington's disease",
];

const PUBLICATION_TYPES = [
  'Clinical trial', 'Randomized controlled trial', 'Systematic review', 'Meta-analysis', 'Case report',
  'Case series', 'Clinical study', 'Observational study', 'Cohort study', 'Case-control study',
  'Cross-sectional study', 'Retrospective study', 'Prospective study', 'Review article', 'Research article',
  'Letter to the editor', 'Editorial', 'Commentary', 'Short communication', 'Conference abstract',
  'Poster presentation', 'Practice guideline', 'Consensus statement', 'Narrative review', 'Scoping review',
  'Umbrella review', 'Network meta-analysis', 'Real-world evidence study', 'Post-marketing surveillance study',
  'Pharmacoeconomic study', 'Health technology assessment', 'Phase I trial', 'Phase II trial', 'Phase III trial',
  'Phase IV trial', 'Basket trial', 'Umbrella trial', 'Platform trial', 'Adaptive clinical trial',
  'Single-arm trial', 'Open-label trial', 'Double-blind trial', 'Crossover trial', 'Non-inferiority trial',
  'Dose-escalation study', 'Pharmacokinetic study', 'Pharmacodynamic study', 'Biomarker study',
  'Diagnostic accuracy study', 'Qualitative study', 'Mixed-methods study', 'Registry study',
  'Longitudinal study', 'Ecological study', 'Correlational study', 'Validation study', 'Protocol paper',
  'Study protocol', 'Erratum', 'Corrigendum', 'Retraction', 'Preprint', 'Technical note', 'Methodology paper',
  'Brief report', 'Rapid communication', 'Perspective article', 'Opinion piece', 'Point of view',
  'Debate article', 'Tutorial', 'Guideline update', 'Position paper', 'White paper', 'Policy brief',
  'Expert opinion', 'Delphi study', 'Living systematic review', 'Rapid review', 'Literature review',
  'Integrative review', 'Bibliometric analysis', 'Citation analysis', 'Economic evaluation',
  'Budget impact analysis', 'Cost-effectiveness analysis', 'Cost-utility analysis', 'Decision-analytic model',
  'Markov model', 'Discrete event simulation', 'Real-world data study', 'Claims data analysis',
  'Electronic health record study', 'Patient-reported outcome study', 'Quality of life study', 'Safety study',
  'Pharmacovigilance report', 'Adverse event report', 'Drug interaction study', 'Bioequivalence study',
  'First-in-human study', 'Compassionate use report', 'Expanded access report',
];

// Deterministic pseudo-random spread so dates don't shift between
// renders/sessions — a plain LCG seeded from the item's index.
function dummyDate(seedIndex: number): string {
  const seed = (seedIndex * 9301 + 49297) % 233280;
  const rand = seed / 233280;
  const start = new Date('2010-01-01').getTime();
  const end = new Date('2026-11-01').getTime();
  return new Date(start + rand * (end - start)).toISOString().slice(0, 10);
}

function buildItems(category: CriteriaCategory, names: string[]): CriteriaItem[] {
  return names.map((name, i) => ({
    id: `${category}-${i}`,
    name,
    category,
    firstSeen: dummyDate(i + category.length),
  }));
}

interface HierarchyDef {
  name: string;
  children: string[];
}

// A handful of parent/child groups, layered on top of the existing flat
// lists rather than replacing anything in them — e.g. "Diabetes" and its
// four subtypes are new entries, added alongside (not instead of) the
// pre-existing standalone "Type 2 diabetes" item.
function buildHierarchyItem(category: CriteriaCategory, groupIndex: number, def: HierarchyDef): CriteriaItem {
  const parentId = `${category}-group-${groupIndex}`;
  const parentSeed = 1000 + category.length + groupIndex * 10;
  return {
    id: parentId,
    name: def.name,
    category,
    firstSeen: dummyDate(parentSeed),
    children: def.children.map((name, j) => ({
      id: `${parentId}-${j}`,
      name,
      category,
      firstSeen: dummyDate(parentSeed + j + 1),
    })),
  };
}

const COMPETITOR_HIERARCHIES: HierarchyDef[] = [
  { name: 'NHS', children: ['NHS England', 'NHS Scotland', 'NHS Wales', 'NHS Northern Ireland'] },
];

const DISEASE_HIERARCHIES: HierarchyDef[] = [
  { name: 'Diabetes', children: ['Type 1 Diabetes', 'Type 2 Diabetes', 'Gestational Diabetes', 'Other Specific Types'] },
  {
    name: 'Breast Cancer',
    children: ['Triple-Negative Breast Cancer', 'HER2-Positive Breast Cancer', 'Hormone Receptor-Positive Breast Cancer'],
  },
];

// A–Z by name, applied at both levels — top-level entries (standalone
// items and parents) within a category, and a parent's own children —
// so the list is always alphabetical regardless of how any of these
// arrays were assembled above.
function sortAlphabetically(items: CriteriaItem[]): CriteriaItem[] {
  return [...items]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item) => (item.children ? { ...item, children: sortAlphabetically(item.children) } : item));
}

export const CRITERIA_BY_CATEGORY: Record<CriteriaCategory, CriteriaItem[]> = {
  competitors: sortAlphabetically([
    ...buildItems('competitors', COMPETITORS),
    ...COMPETITOR_HIERARCHIES.map((def, i) => buildHierarchyItem('competitors', i, def)),
  ]),
  drugs: sortAlphabetically(buildItems('drugs', DRUGS)),
  diseases: sortAlphabetically([
    ...buildItems('diseases', DISEASES),
    ...DISEASE_HIERARCHIES.map((def, i) => buildHierarchyItem('diseases', i, def)),
  ]),
  publication_type: sortAlphabetically(buildItems('publication_type', PUBLICATION_TYPES)),
};

function flattenItem(item: CriteriaItem): CriteriaItem[] {
  return [item, ...(item.children ?? []).flatMap(flattenItem)];
}

// Includes children (for resolving a selected child id back to its name
// in the Rename step), unlike CRITERIA_BY_CATEGORY which only lists
// top-level entries — nested children are rendered under their parent,
// not as independent top-level rows.
export const ALL_CRITERIA: CriteriaItem[] = Object.values(CRITERIA_BY_CATEGORY).flatMap((items) => items.flatMap(flattenItem));

// parent id -> its children's ids, and the reverse lookup — built once
// from the same hierarchy data, so selection logic never has to walk
// the tree itself.
export const PARENT_CHILD_IDS: Record<string, string[]> = {};
export const CHILD_PARENT_ID: Record<string, string> = {};
for (const items of Object.values(CRITERIA_BY_CATEGORY)) {
  for (const item of items) {
    if (!item.children) continue;
    PARENT_CHILD_IDS[item.id] = item.children.map((c) => c.id);
    for (const child of item.children) CHILD_PARENT_ID[child.id] = item.id;
  }
}
