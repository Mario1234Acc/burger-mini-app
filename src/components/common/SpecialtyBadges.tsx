interface SpecialtyBadgesProps {
  specialties: string[];
}

export const SpecialtyBadges = ({ specialties }: SpecialtyBadgesProps) => {
  const display = specialties.slice(0, 3);
  const remaining = specialties.length - 3;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {display.map((specialty) => (
        <span key={specialty} className="text-[10px] font-semibold bg-zinc-100 text-zinc-600 px-2 py-1 rounded-md">
          {specialty}
        </span>
      ))}
      {remaining > 0 && (
        <span className="text-[10px] font-bold bg-teal-50 text-teal-600 px-2 py-1 rounded-md">
          +{remaining}
        </span>
      )}
    </div>
  );
};
