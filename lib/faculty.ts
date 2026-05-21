import { SITE } from './site';

export type FacultyMember = {
  id: string;
  name: string;
  title: string;
  bio: string;
  expertise: string[];
  tbd: boolean;
  imageKey?: string;
  linkedinUrl?: string;
};

const FACULTY: FacultyMember[] = [
  {
    id: 'will-stepaniak',
    name: 'Will Stepaniak',
    title: 'Founder & Lead Instructor',
    bio: 'Will built DeskPilot Academy out of years on the desk — running F&I, structuring deals, and watching the gap between what operators actually do and what training products teach. The Academy exists to close that gap.',
    expertise: ['F&I', 'Desking', 'Lender Programs', 'Menu Presentation'],
    tbd: false,
    imageKey: 'will',
    linkedinUrl: SITE.founderLinkedin,
  },
  // TODO(Will): confirm faculty
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `placeholder-${i + 1}`,
    name: 'Announcing Soon',
    title: 'Faculty — Position Open',
    bio: 'We are recruiting operators with on-the-desk experience to lead this campus. If that is you, the contact form is open.',
    expertise: [],
    tbd: true,
  })),
];

export async function getAllFaculty(): Promise<FacultyMember[]> {
  return FACULTY;
}

export async function getFacultyById(id: string): Promise<FacultyMember | undefined> {
  return FACULTY.find((m) => m.id === id);
}

export async function getNamedFaculty(): Promise<FacultyMember[]> {
  return FACULTY.filter((m) => !m.tbd);
}
