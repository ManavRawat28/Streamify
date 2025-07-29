import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";
import { MapPinIcon } from "lucide-react"; // optional, if location exists
import { capitialize } from "../lib/util"; // assuming you already use this

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-lg transition-all duration-300">
      <div className="card-body p-5 space-y-4">
        {/* Avatar + Name + Optional Location */}
        <div className="flex items-center gap-3">
          <div className="avatar size-16 rounded-full overflow-hidden">
            {friend.profilePic ? (
              <img
                src={friend.profilePic}
                alt={friend.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="bg-neutral text-neutral-content w-full h-full flex items-center justify-center text-sm font-medium uppercase">
                {friend.fullName?.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg">{friend.fullName}</h3>
            {friend.location && (
              <div className="flex items-center text-xs opacity-70 mt-1">
                <MapPinIcon className="size-3 mr-1" />
                {friend.location}
              </div>
            )}
          </div>
        </div>

        {/* Languages with flags */}
        <div className="flex flex-wrap gap-1.5">
          <span className="badge badge-secondary">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {capitialize(friend.nativeLanguage)}
          </span>
          <span className="badge badge-outline">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {capitialize(friend.learningLanguage)}
          </span>
        </div>

        {friend.bio && <p className="text-sm opacity-70">{friend.bio}</p>}

        {/* Message button */}
        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full mt-2">
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;

// helper to get flag emoji by language
export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
