export default function TopBarLocation({ location }: { location: string }) {
  return (
    <>
      INFRAWATCH / <span className="text-blue-600 font-medium">{location}</span>
    </>
  );
}
