# 🚀 MicroLearn - Setup Guide

## 📋 Prerequisites

- **PHP 8.0+**
- **Composer**
- **MySQL/MariaDB**
- **Node.js 16+**
- **Expo CLI**
- **React Native development environment**

## 🗄️ Database Setup

1. **Create Database**
   ```sql
   CREATE DATABASE belearn;
   ```

2. **Import Sample Data**
   - Open `sample-data.sql` in phpMyAdmin or MySQL client
   - Execute the SQL file to populate database with sample themes, courses, and lessons

## 🔧 Backend Setup (Symfony)

1. **Install Dependencies**
   ```bash
   cd c:/xampp/htdocs/backend
   composer install
   ```

2. **Start API Server**
   ```bash
   php -S 0.0.0.0:8001 -t public
   ```

3. **Verify API Working**
   - Open browser: `http://localhost:8001/api/themes`
   - Should return JSON with themes data

## 📱 Frontend Setup (React Native)

1. **Install Dependencies**
   ```bash
   cd c:/xampp/htdocs/backend/beLearn
   npm install
   ```

2. **Start Expo Development Server**
   ```bash
   npx expo start
   ```

3. **Test on Device**
   - Scan QR code with Expo Go app
   - Or run on emulator: `npx expo start --android` / `npx expo start --ios`

## 🎯 Testing the Application

### **Navigation Test**
1. Open app → Click "🚀 Test Navigation"
2. Test all screens from NavigationTest screen
3. Verify API calls work correctly

### **Complete Flow Test**
1. **HomeScreen**: Browse themes
2. **CoursesScreen**: View courses for selected theme  
3. **LessonsScreen**: View lessons and watch videos
4. **YouTube Player**: Play lesson videos

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/themes` | List all themes |
| GET | `/api/cours` | List all published courses |
| GET | `/api/cours/{id}/lecons` | Get lessons for course |
| GET | `/api/cours/theme/{themeId}` | Get courses by theme |
| GET | `/api/cours/{id}` | Get single course |
| GET | `/api/lecons/{id}` | Get single lesson |

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── Entity/          # Doctrine entities
│   ├── Controller/      # API controllers
│   └── DataFixtures/    # Sample data fixtures
├── beLearn/
│   ├── app/
│   │   ├── screens/    # React Native screens
│   │   └── (tabs)/     # Tab navigation
│   ├── src/
│   │   ├── services/   # API services
│   │   ├── theme/      # UI theme
│   │   └── config/     # Configuration
│   └── package.json
└── sample-data.sql      # Sample database data
```

## 🎨 UI Features

- ✅ **Modern Design**: Udemy/Coursera inspired interface
- ✅ **Cards**: Shadow effects, rounded corners, proper spacing
- ✅ **Loading States**: Activity indicators, error handling
- ✅ **Pull-to-Refresh**: Refresh data on all screens
- ✅ **Progress Tracking**: Course completion, lesson progress
- ✅ **Video Player**: YouTube integration with react-native-youtube-iframe
- ✅ **Responsive**: Works on all screen sizes

## 🔧 Configuration

### **API Base URL**
```typescript
// beLearn/src/config/api.ts
const API_BASE_URL = "http://192.168.61.185:8001/api";
```

### **Database Connection**
```env
# .env.local
DATABASE_URL="mysql://root:@127.0.0.1:3306/belearn"
```

## 🚨 Troubleshooting

### **API Not Working**
1. Ensure Symfony server is running on port 8001
2. Check database connection in `.env.local`
3. Verify sample data is imported

### **Import Path Errors**
1. Check all imports use correct paths:
   - `../../src/services/learningApi` (from screens)
   - `../src/theme/theme` (from app)

### **YouTube Player Issues**
1. Ensure `react-native-youtube-iframe` is installed
2. Check YouTube video URLs are valid
3. Test on real device (may not work in simulator)

### **Navigation Issues**
1. Verify all screens are registered in `_layout.tsx`
2. Check Expo Router navigation paths
3. Use NavigationTest screen to verify all routes

## 🎯 Sample Data

The application includes sample data with:
- **3 Themes**: Web Development, Mobile Development, UI/UX Design
- **4 Courses**: HTML/CSS, JavaScript, React Native, UI Design
- **7 Lessons**: Video and text-based lessons with YouTube links

## 📱 Testing Checklist

- [ ] API server running on port 8001
- [ ] Sample data loaded in database
- [ ] React Native app starts without errors
- [ ] Navigation between screens works
- [ ] API calls return data
- [ ] YouTube videos play correctly
- [ ] Progress tracking works
- [ ] Pull-to-refresh functions
- [ ] Error handling displays correctly

## 🚀 Ready to Use!

Once setup is complete, your micro-learning platform is ready for:
- **Theme browsing**
- **Course enrollment** 
- **Lesson viewing**
- **Progress tracking**
- **Video learning**

Enjoy your MicroLearn platform! 🎓✨
