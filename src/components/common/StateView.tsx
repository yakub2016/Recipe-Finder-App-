import type { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/theme";

type Props = {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyText?: string;
  onRetry?: () => void;
  children: ReactNode;
};

/** Shows loading, error or empty states; otherwise renders children. */
export default function StateView({
  loading,
  error,
  empty,
  emptyText = "Nothing here yet.",
  onRetry,
  children,
}: Props) {
  if (loading) {
    return (
      <View style={styles.box}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.box}>
        <Text style={styles.errorTitle}>Couldn&apos;t load recipes</Text>
        <Text style={styles.muted}>{error}</Text>
        {onRetry && (
          <TouchableOpacity onPress={onRetry} style={styles.retry}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (empty) {
    return (
      <View style={styles.box}>
        <Text style={styles.muted}>{emptyText}</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  box: {
    paddingVertical: 32,
    alignItems: "center",
    gap: 8,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  muted: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  retry: {
    marginTop: 8,
    paddingHorizontal: 18,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: "center",
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
