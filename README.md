# Shadow Direction Simulator

An interactive 3D educational tool built with Three.js that helps users understand how shadows are cast based on the sun's position. This simulator provides a realistic space environment where users can experiment with different sun positions, add objects and people, and observe how shadows change throughout the day.

## 🌟 Features

### Core Functionality
- **Interactive Sun Control**: Adjust sun position using sliders or keyboard controls
- **Real-time Shadow Calculation**: Shadows update dynamically as the sun moves
- **3D Space Environment**: Immersive space-themed background with stars and realistic lighting
- **Object Interaction**: Add, move, and rotate objects and people in the scene
- **Direction Setting**: Click objects to set their facing direction with an intuitive modal
- **Compass Integration**: Visual compass showing sun position and shadow direction

### Educational Tools
- **Time of Day Indicators**: Visual feedback showing sunrise, noon, sunset, and night
- **Sun Intensity Visualization**: Dynamic intensity bar showing sun strength
- **Shadow Direction Messages**: Clear feedback about shadow directions
- **Multiple Viewpoints**: Switch between different camera angles (front, top, left, right, etc.)
- **Scale Controls**: Adjust object sizes for better visibility

### Interactive Controls
- **Auto Sun Movement**: Automatic sun rotation with adjustable speed and direction
- **Keyboard Shortcuts**: Quick access to common functions
- **Mouse Interaction**: Drag objects, rotate camera, and zoom
- **Preset Positions**: Quick sun position presets for different times of day

## 🚀 Getting Started

### Prerequisites
- Modern web browser with WebGL support
- Local web server (for loading textures and assets)

### Installation
1. Clone or download the project files
2. Ensure all image assets are in the same directory:
   - `space.png` - Space background
   - `sun.png` - Sun texture
   - `compass.png` - Compass background
   - `person.png` - Person icon
   - `object.png` - Object icon
   - `reset_button.png` - Reset button icon
   - `moon.png` - Moon texture (if used)

3. Start a local web server in the project directory:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

4. Open your browser and navigate to `http://localhost:8000`

## 🎮 How to Use

### Basic Controls
- **Sun Position**: Use the angle slider to move the sun around the horizon
- **Sun Height**: Use the height slider to adjust the sun's elevation
- **Add Objects**: Click "Add Object" to place a random colored box in the scene
- **Add People**: Click "Add Person" to add a person figure with direction indicator
- **Reset Scene**: Clear all objects and start fresh

### Object Interaction
1. **Moving Objects**: Click and drag any object to reposition it
2. **Setting Direction**: Click an object to open the direction modal
3. **Direction Selection**: Choose from 8 compass directions (N, NE, E, SE, S, SW, W, NW)
4. **Shadow Feedback**: Receive immediate feedback about shadow direction

### Advanced Features
- **Auto Movement**: Toggle automatic sun movement with the play/pause button
- **Speed Control**: Adjust the speed of automatic sun movement (0.5x to 5x)
- **Direction Control**: Switch between clockwise and counterclockwise movement
- **Viewpoint Control**: Use the directional arrows to change camera perspective
- **Scale Control**: Adjust object sizes using the scale buttons

### Keyboard Shortcuts
- **Spacebar**: Toggle auto sun movement
- **R**: Reverse sun movement direction
- **1-4**: Quick presets (Sunrise, Noon, Sunset, Night)
- **Arrow Keys**: Manual sun position adjustment
- **+/-**: Scale objects up/down
- **V**: Cycle through viewpoints

### Mouse Controls
- **Left Click**: Select and drag objects
- **Right Click + Drag**: Rotate camera view
- **Mouse Wheel**: Zoom in/out

## 🎯 Educational Objectives

This simulator helps users understand:
- **Shadow Formation**: How shadows are created by blocking light
- **Sun Position Effects**: How the sun's position affects shadow direction and length
- **Time of Day Correlation**: Relationship between sun position and time
- **Directional Awareness**: Understanding compass directions and spatial relationships
- **3D Spatial Reasoning**: Visualizing 3D relationships in space

## 🛠️ Technical Details

### Built With
- **Three.js**: 3D graphics library for WebGL
- **HTML5 Canvas**: Rendering surface
- **CSS3**: Styling and animations
- **Vanilla JavaScript**: Core functionality

### Key Components
- **Scene Management**: 3D scene with lighting, objects, and environment
- **Shadow Calculation**: Real-time shadow direction computation
- **User Interface**: Intuitive controls and feedback systems
- **Asset Management**: Texture loading and material handling
- **Animation System**: Smooth transitions and continuous rendering

### Performance Features
- **Optimized Rendering**: Efficient shadow mapping and lighting
- **Responsive Design**: Adapts to different screen sizes
- **Smooth Animations**: 60fps rendering with requestAnimationFrame
- **Memory Management**: Proper cleanup of 3D objects

## 📁 Project Structure

```
shadow-direction-simulator/
├── index.html          # Main HTML file with UI structure
├── app.js             # Core JavaScript functionality
├── README.md          # This documentation file
├── LICENSE            # License information
├── todo.md            # Development notes and requirements
└── assets/
    ├── space.png      # Space background texture
    ├── sun.png        # Sun texture
    ├── compass.png    # Compass background
    ├── person.png     # Person icon
    ├── object.png     # Object icon
    ├── reset_button.png # Reset button icon
    └── moon.png       # Moon texture
```

## 🎨 Customization

### Adding New Features
- Modify `app.js` to add new object types or interactions
- Update `index.html` to add new UI controls
- Add new textures by placing them in the project directory

### Styling Changes
- Edit the CSS in `index.html` to customize the appearance
- Modify colors, fonts, and layout as needed
- Add new themes or visual styles

## 🐛 Troubleshooting

### Common Issues
1. **Textures not loading**: Ensure you're running a local web server
2. **Objects not appearing**: Check browser console for WebGL errors
3. **Poor performance**: Try reducing the number of objects or lowering quality settings
4. **Controls not working**: Verify JavaScript is enabled in your browser

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📚 Educational Use Cases

### Classroom Applications
- **Geography Lessons**: Understanding sun position and shadows
- **Physics Education**: Light and shadow principles
- **Astronomy Classes**: Sun-Earth relationships
- **STEM Learning**: Interactive 3D visualization

### Learning Outcomes
- Spatial reasoning development
- Understanding of light and shadow physics
- Compass and directional skills
- Time and sun position correlation

## 🤝 Contributing

Contributions are welcome! Please feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is licensed under the terms specified in the LICENSE file.

## 🙏 Acknowledgments

- Three.js community for the excellent 3D library
- Educational institutions that inspired this learning tool
- Contributors and testers who helped improve the simulator

---

**Happy Learning!** 🌞📚

For questions or support, please refer to the project documentation or create an issue in the project repository.