import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../src/theme/theme';
import { commonStyles } from '../src/styles/commonStyles';

// Mock data
const mockCategories = [
  { id: 1, name: 'Développement', count: 12, color: colors.categories.development },
  { id: 2, name: 'Design', count: 8, color: colors.categories.design },
  { id: 3, name: 'Marketing', count: 6, color: colors.categories.marketing },
  { id: 4, name: 'Intelligence Artificielle', count: 5, color: colors.categories.ai },
];

const mockCourses = [
  {
    id: 1,
    title: 'Développement Web',
    subtitle: 'HTML, CSS, JavaScript',
    rating: 4.8,
    reviews: 120,
    duration: '2h 30min',
    category: 'Développement',
    color: colors.categories.development,
  },
  {
    id: 2,
    title: 'UI/UX Design',
    subtitle: 'Principes du design',
    rating: 4.6,
    reviews: 89,
    duration: '1h 45min',
    category: 'Design',
    color: colors.categories.design,
  },
  {
    id: 3,
    title: 'Marketing Digital',
    subtitle: 'Stratégies en ligne',
    rating: 4.7,
    reviews: 156,
    duration: '3h 15min',
    category: 'Marketing',
    color: colors.categories.marketing,
  },
];

const popularSuggestions = ['Développement', 'Design', 'Marketing', 'IA'];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState(mockCourses);
  const [filteredCourses, setFilteredCourses] = useState(mockCourses);

  useEffect(() => {
    filterCourses();
  }, [searchQuery, selectedCategory, courses]);

  const filterCourses = () => {
    let filtered = courses;

    // Filter by category
    if (selectedCategory !== 'Tous') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const renderCategoryCard = ({ item }: any) => (
    <TouchableOpacity style={[styles.categoryCard, { backgroundColor: item.color }]}>
      <View style={styles.categoryContent}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryCount}>{item.count} cours</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCourseCard = ({ item }: any) => (
    <TouchableOpacity style={styles.courseCard}>
      <View style={[styles.courseIcon, { backgroundColor: item.color }]}>
        <Text style={styles.courseIconText}>
          {item.title.substring(0, 2).toUpperCase()}
        </Text>
      </View>
      <View style={styles.courseContent}>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <Text style={styles.courseSubtitle}>{item.subtitle}</Text>
        <View style={styles.courseMeta}>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color={colors.warning} />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewsText}>({item.reviews})</Text>
          </View>
          <Text style={styles.duration}>{item.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSuggestionChip = (suggestion: string) => (
    <TouchableOpacity
      key={suggestion}
      style={styles.suggestionChip}
      onPress={() => handleSearch(suggestion)}
    >
      <Text style={styles.suggestionText}>{suggestion}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu-outline" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MicroLearn</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileAvatar}>
              <Ionicons name="person" size={16} color={colors.textWhite} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.searchTitle}>Rechercher un cours</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un cours, un thème..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
          
          {/* Popular Suggestions */}
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Suggestions populaires</Text>
            <View style={styles.suggestionsList}>
              {popularSuggestions.map(renderSuggestionChip)}
            </View>
          </View>
        </View>

        {/* Search Results */}
        {searchQuery.trim() && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>Résultats ({filteredCourses.length})</Text>
            <FlatList
              data={filteredCourses}
              renderItem={renderCourseCard}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Categories Section */}
        {!searchQuery.trim() && (
          <View style={styles.categoriesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Thèmes disponibles</Text>
              <TouchableOpacity style={styles.filterButton}>
                <Ionicons name="filter-outline" size={20} color={colors.primary} />
                <Text style={styles.filterText}>Filtres</Text>
              </TouchableOpacity>
            </View>
            
            {/* Category Pills */}
            <View style={styles.categoryPills}>
              {['Tous', 'Développement', 'Design', 'Marketing'].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryPill,
                    selectedCategory === category && styles.categoryPillActive
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryPillText,
                    selectedCategory === category && styles.categoryPillTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Category Grid */}
            <View style={styles.categoryGrid}>
              <FlatList
                data={mockCategories}
                renderItem={renderCategoryCard}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={styles.categoryRow}
              />
            </View>
          </View>
        )}

        {/* Recent Courses Section */}
        {!searchQuery.trim() && (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cours récents</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={filteredCourses.slice(0, 1)}
              renderItem={renderCourseCard}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    ...commonStyles.card,
  },
  menuButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h3,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  notificationButton: {
    padding: spacing.xs,
  },
  profileButton: {
    padding: spacing.xs,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  searchSection: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  searchTitle: {
    ...typography.h2,
    marginBottom: spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    ...typography.body,
    color: colors.text,
  },
  suggestionsContainer: {
    marginTop: spacing.lg,
  },
  suggestionsTitle: {
    ...typography.h4,
    marginBottom: spacing.md,
  },
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  suggestionChip: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  resultsSection: {
    paddingBottom: spacing.xl,
  },
  resultsTitle: {
    ...typography.h3,
    marginBottom: spacing.lg,
  },
  categoriesSection: {
    paddingBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  filterText: {
    ...typography.caption,
    color: colors.primary,
  },
  categoryPills: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  categoryPill: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryPillText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  categoryPillTextActive: {
    color: colors.textWhite,
  },
  categoryGrid: {
    marginTop: spacing.lg,
  },
  categoryRow: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...commonStyles.card,
    marginBottom: spacing.md,
  },
  categoryContent: {
    alignItems: 'center',
  },
  categoryName: {
    ...typography.h4,
    color: colors.textWhite,
    marginBottom: spacing.xs,
  },
  categoryCount: {
    ...typography.caption,
    color: colors.textWhite,
    opacity: 0.9,
  },
  recentSection: {
    paddingBottom: spacing.xxl,
  },
  seeAllText: {
    ...typography.caption,
    color: colors.primary,
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...commonStyles.card,
  },
  courseIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  courseIconText: {
    ...typography.h4,
    color: colors.textWhite,
    fontWeight: 'bold',
  },
  courseContent: {
    flex: 1,
  },
  courseTitle: {
    ...typography.h4,
    marginBottom: spacing.xs,
  },
  courseSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  courseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    ...typography.caption,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  reviewsText: {
    ...typography.small,
    color: colors.textTertiary,
    marginLeft: spacing.xs,
  },
  duration: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
