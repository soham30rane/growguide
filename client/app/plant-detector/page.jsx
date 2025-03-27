import PlantDiseaseDetector from '@/components/plant-disease-detector';

export default function PlantDetectorPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Plant Health Analysis</h1>
      <PlantDiseaseDetector />
    </div>
  );
}