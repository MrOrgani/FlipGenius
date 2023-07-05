import { Link } from "react-router-dom";

export const CollectionCard: React.FC<Collection> = ({
  name = "No name",
  id,
}) => {
  return (
    <Link to={`/collection/${id}`}>
      <div
        className={
          "min-w-80 flex h-52  w-80 items-center justify-center rounded-3xl  bg-violet-200 "
        }
      >
        <span className="text-2xl text-indigo-600">{name}</span>
      </div>
    </Link>
  );
};
