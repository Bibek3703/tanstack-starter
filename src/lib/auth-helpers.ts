const AVATAR_COLORS = [
    "EF4444", "DC2626", "F43F5E", "E11D48", "BE123C",
    "F97316", "EA580C", "FB923C", "F59E0B", "D97706",
    "EAB308", "CA8A04", "84CC16", "65A30D", "4D7C0F",
    "22C55E", "16A34A", "15803D", "10B981", "059669",
    "14B8A6", "0D9488", "06B6D4", "0891B2", "0E7490",
    "3B82F6", "2563EB", "1D4ED8", "0EA5E9", "0284C7",
    "6366F1", "4F46E5", "4338CA", "8B5CF6", "7C3AED",
    "A855F7", "9333EA", "C026D3", "A21CAF", "86198F",
    "64748B", "475569", "334155", "78716C", "57534E"
];

export function getAvatarColor(seed: string) {
    let hash = 0;

    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}