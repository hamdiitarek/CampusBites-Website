import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const sampleUniversities = [
  {
    id: 'cairo-university',
    name: 'Cairo University',
    nameAr: 'جامعة القاهرة',
    emailDomain: 'cu.edu.eg',
    city: 'Cairo',
    cityAr: 'القاهرة',
    address: 'Giza, Cairo Governorate',
    addressAr: 'الجيزة، محافظة القاهرة',
    phone: '+20 2 35676105',
    website: 'https://cu.edu.eg',
    isActive: true
  },
  {
    id: 'ain-shams-university',
    name: 'Ain Shams University',
    nameAr: 'جامعة عين شمس',
    emailDomain: 'asu.edu.eg',
    city: 'Cairo',
    cityAr: 'القاهرة',
    address: 'Abbassia, Cairo',
    addressAr: 'العباسية، القاهرة',
    phone: '+20 2 26831474',
    website: 'https://asu.edu.eg',
    isActive: true
  },
  {
    id: 'alexandria-university',
    name: 'Alexandria University',
    nameAr: 'جامعة الإسكندرية',
    emailDomain: 'alexu.edu.eg',
    city: 'Alexandria',
    cityAr: 'الإسكندرية',
    address: 'Alexandria, Egypt',
    addressAr: 'الإسكندرية، مصر',
    phone: '+20 3 3911794',
    website: 'https://alexu.edu.eg',
    isActive: true
  }
];

export async function createSampleUniversities() {
  try {
    console.log('Creating sample universities...');
    
    // Check if universities already exist
    const universitiesSnapshot = await getDocs(collection(db, 'universities'));
    if (universitiesSnapshot.size > 0) {
      console.log('Universities already exist, skipping creation');
      return;
    }
    
    // Create universities
    for (const university of sampleUniversities) {
      await setDoc(doc(db, 'universities', university.id), {
        ...university,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log(`Created university: ${university.name}`);
    }
    
    console.log('Sample universities created successfully!');
  } catch (error) {
    console.error('Error creating sample universities:', error);
  }
}
