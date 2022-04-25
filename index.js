import React, { Component } from 'react';
import { ActivityIndicator, BackHandler, Image, LayoutAnimation, Platform, SafeAreaView, Slider, StatusBar, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { BackIcon, DEVICE_ORIENTATIONS, ExitFullScreenIcon, ReplayIcon, FullScreenIcon, LockIcon, MenuIcon, NextIcon, OpenLockIcon, PauseIcon, PlayIcon, PreviousIcon, RATE } from './constants';
import { calculatePercentage, formatTime } from './utility';
import Menu from './menu';
import Orientation from 'react-native-orientation-locker';
import Video from 'react-native-video';
import Button from './Button';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default class VideoPlayer extends Component {

    static defaultProps = {
        autoPlay: true,
        autoPlayNextVideo: true,
        controlTimeout: 2000,
        data: [],
        defaultVideoIndex: 0,
        delay: 0,
        fullscreenOrientation: 'all',
        loop: 'none',
        onEnd: () => { },
        onLoad: () => { },
        onLoadStart: () => { },
        onPause: () => { },
        onPlay: () => { },
        onError: (error) => { },
        onPlayingVideo: () => { },
        rate: 1,
        pause: false,
        resizeMode: 'contain',
        showBottomProgresssBar: true,
        showLockOrientationIcon: true,
        noBackButton: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            currentTime: 0,
            currentTrack: props.defaultVideoIndex > props.data.length - 1 ? 0 : props.defaultVideoIndex,
            isFullscreen: props.fullscreenOrientation == 'landscape',
            loading: false,
            locked: false,
            play: props.autoPlay,
            playableDuration: 0,
            rate: this.props.rate,
            replay: false,
            seekableDuration: 0,
            showMenu: false,
            showPanel: false,
            noBackButton: false,
        };
        this.timeoutRef = '';
        this.player = '';
        console.disableYellowBox = true;
    }

    componentDidMount() {
        let { isFullscreen } = this.state;
        isFullscreen ? Orientation.lockToLandscapeLeft() :
            Orientation.getDeviceOrientation(this._rotateDevice);
        this._addOrientationListner();
        Platform.OS == 'android' && this._androidBackHandlerListner();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.pause !== this.props.pause) {
            this.setState({play: !this.props.pause})
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutRef);
        Orientation.removeDeviceOrientationListener(this._rotateDevice);
        BackHandler.removeEventListener("hardwareBackPress", this._onBackPress);
    }


    _androidBackHandlerListner = () => {
        BackHandler.addEventListener('hardwareBackPress', this._onBackPress);
    }

    _addOrientationListner = () => {
        Orientation.addDeviceOrientationListener(this._rotateDevice);;
    }

    _onBackPress = () => {
        if (this.state.isFullscreen) {
            if (this.props.fullscreenOrientation == 'all') {
                this.setState({ isFullscreen: false });
            } else {
                let { onBack } = this.props;
                onBack ? onBack() : BackHandler.exitApp();
            }
            Orientation.lockToPortrait();
        } else if (this.state.locked) {

        } else {
            let { onBack } = this.props;
            onBack ? onBack() : BackHandler.exitApp();
        }
        return true;
    }

    _rotateDevice = (value) => {
        let { isFullscreen, locked } = this.state;
        let { fullscreenOrientation } = this.props;
        if (!locked && fullscreenOrientation == 'all') {
            Orientation.getAutoRotateState((state) => {
                if (value == DEVICE_ORIENTATIONS[1]) {
                    state && (this.setState({ isFullscreen: true }), Orientation.lockToLandscapeLeft());
                    (!state && isFullscreen) && Orientation.lockToLandscapeLeft();
                } else if (value == DEVICE_ORIENTATIONS[2]) {
                    state && (this.setState({ isFullscreen: true }), Orientation.lockToLandscapeRight());
                    (!state && isFullscreen) && Orientation.lockToLandscapeRight();
                }
                else if (state && isFullscreen) {
                    this.setState({ isFullscreen: false });
                    Orientation.lockToPortrait();
                }
            })
        }
    }

    _onTogglePlay = () => {
        let { play } = this.state;
        let { onPause = () => { }, onPlay = () => { } } = this.props;
        LayoutAnimation.easeInEaseOut();
        play ? onPause() : onPlay();
        this.setState({ play: !play }, () => this._onTogglePanel(true));
    }

    _toggleLoad = (loading, e) => {
        let { onLoadStart = () => { }, onLoad = () => { } } = this.props;
        LayoutAnimation.easeInEaseOut();
        loading ? onLoadStart(e) : onLoad(e)
        this.setState({ loading })
    }

    _onTogglePanel = (show) => {
        LayoutAnimation.easeInEaseOut();
        this.setState({ showPanel: show });
        clearTimeout(this.timeoutRef);
        this.state.play && (this.timeoutRef = setTimeout(() => {
            LayoutAnimation.easeInEaseOut();
            this.setState({ showPanel: false })
        }, this.props.controlTimeout))
    }

    _onVideoEnd = (e) => {
        let { loop, data, autoPlayNextVideo, onEnd } = this.props;
        let { currentTrack } = this.state;
        onEnd(e);
        setTimeout(() => {
            LayoutAnimation.easeInEaseOut();
            loop == 'one' ?
                this.player.seek(0) :
                loop == 'all' ?
                    this.setState({ currentTrack: (currentTrack == data.length - 1) ? 0 : (currentTrack + 1) })
                    :
                    (loop == 'none' && autoPlayNextVideo && (currentTrack < data.length - 1)) ? this.setState({ currentTrack: currentTrack + 1 })
                        : this.setState({ replay: true }, () => this._onTogglePanel(true))
        }, this.props.delay)
    }

    _onChangeTrack = (track) => {
        this.setState({ currentTrack: track, replay: false, play: true }, () => this._onTogglePanel(true));
        setTimeout(() => this.setState({ replay: false }), 1000)
    }

    _onToggleFullscreen = () => {
        let { isFullscreen } = this.state;
        this.setState({ isFullscreen: !isFullscreen, });
        isFullscreen ? Orientation.lockToPortrait() : Orientation.lockToLandscapeLeft();
        this._onTogglePanel(true);
    }

    _onToggleLock = () => {
        LayoutAnimation.easeInEaseOut();
        let { locked } = this.state;
        locked && Orientation.getDeviceOrientation(this._rotateDevice);
        this.setState({ locked: !locked });
        this._onTogglePanel(true);
    }

    _onSeek = (val) => {
        this.timeoutRef && clearTimeout(this.timeoutRef)
        this.setState({ play: false, currentTime: val });
    }

    _onSeekEnd = (e) => {
        this.setState({ play: true, currentTime: e }, () => this._onTogglePanel(true));
        this.player.seek(e);
    }

    renderButton = ({
        customIcon,
        icon,
        onLongPress = () => { },
        onPress = () => { },
        style = {},
    }) => {
        return (<TouchableOpacity
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            onLongPress={onLongPress}
            onPress={onPress}
            style={{ marginHorizontal: 5, ...style }}
        >
            {customIcon ? customIcon : <Image source={icon} style={{ width: 20, height: 20 }} />}
        </TouchableOpacity>)
    }

    _renderPanelTop = () => {
        let { locked, currentTrack } = this.state;
        let { showLockOrientationIcon, titleStyle, data } = this.props;
        return (<View style={styles.panelTopContainer}>
            {this.props.noBackButton ? <View /> :
            <Button
                onPress={this._onBackPress}
                icon={BackIcon}
            />
        }
            <Text style={[styles.title, titleStyle]}>{(data[currentTrack] || '').title || ''}</Text>
            {!!showLockOrientationIcon && <Button
                icon={locked ? LockIcon : OpenLockIcon}
                iconStyle={{ marginRight: -5, marginTop: -5 }}
                onPress={this._onToggleLock}
            />}
            {/* <Button
                                    onPress={() => this.setState({ showMenu: true })}
                                    icon={MenuIcon}
                                /> */}
        </View>)
    }

    _renderPanelBottom = () => {
        let { replay, isFullscreen, locked, currentTime, seekableDuration } = this.state;
        let { fullscreenOrientation } = this.props;

        return (<View style={{ padding: 10 }}>

            {/* {(!locked && !replay) && <Slider
                maximumTrackTintColor="#fafafa"
                maximumValue={seekableDuration}
                minimumTrackTintColor="red"
                minimumValue={0}
                onSlidingComplete={this._onSeekEnd}
                onValueChange={this._onSeek}
                style={{ width: '100%' }}
                thumbTintColor={'red'}
                value={currentTime}
            />} */}
            <View style={styles.timerContainer}>
                <Text style={{ color: 'white' }}>{formatTime(currentTime)}</Text>
                <Slider
                    maximumTrackTintColor="#fafafa"
                    maximumValue={seekableDuration}
                    minimumTrackTintColor="red"
                    minimumValue={0}
                    onSlidingComplete={this._onSeekEnd}
                    onValueChange={this._onSeek}
                    style={{ flex: 1, marginHorizontal: 20 }}
                    thumbTintColor={'red'}
                    value={currentTime}
                />
                <Text style={{ color: 'white', marginRight: 10 }}>{formatTime(seekableDuration)}</Text>
                {(!locked && fullscreenOrientation == 'all') && <Button
                    icon={isFullscreen ? ExitFullScreenIcon : FullScreenIcon}
                    iconStyle={{ marginRight: -5, marginBottom: -5 }}
                    onPress={this._onToggleFullscreen}
                />}
            </View>
        </View>)
    }

    _renderPanelCenter = () => {
        let { play, replay, locked, currentTrack, loading } = this.state;
        let { data, loadingComponent } = this.props;
        return (
            <View style={styles.controlButtonsContainer}>
                <View style={styles.buttonStyle}>
                    {(!locked && !!currentTrack) && <Button
                        icon={PreviousIcon}
                        onPress={() => this._onChangeTrack(currentTrack - 1)}
                    />}
                </View>
                <View style={styles.buttonStyle}>
                    {loading ?
                        loadingComponent ? loadingComponent : <ActivityIndicator size='large' />
                        :
                        replay ?
                            <Button
                                onPress={() => (this.player.seek(0), this.setState({ replay: false, play: true }, () => this._onTogglePanel(true)))}
                                icon={ReplayIcon}
                                iconStyle={{ width: 40, height: 40 }}
                            />
                            :
                            <Button
                                icon={play ? PauseIcon : PlayIcon}
                                onPress={this._onTogglePlay}
                            />
                    }
                </View>
                <View style={styles.buttonStyle}>
                    {(!locked && (currentTrack != data.length - 1)) && <Button
                        icon={NextIcon}
                        onPress={() => this._onChangeTrack(currentTrack + 1)}
                    />}
                </View>
            </View>
        )
    }

    _renderControlPanel = () => {
        let { showPanel } = this.state;
        return (<TouchableOpacity
            activeOpacity={1}
            onPress={() => this._onTogglePanel(!showPanel)}
            style={styles.panelContainer}
        >
            {showPanel && <View style={[{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }, Platform.OS == 'android' && { paddingTop: StatusBar.currentHeight }]}>
                {this._renderPanelTop()}
                <View style={{ flex: 1 }} />
                {this._renderPanelCenter()}
                {this._renderPanelBottom()}
            </View>}
        </TouchableOpacity>)
    }

    _renderTrackProgressBar = () => {
        let { currentTime, seekableDuration, playableDuration, showPanel } = this.state;
        return (<View >
            <View style={styles.progressBar({ width: '100%', color: showPanel ? 'transparent' : 'rgba(255,255,255,0.3)', index: 9 })} />
            <View style={styles.progressBar({ width: calculatePercentage(seekableDuration, playableDuration), color: showPanel ? 'transparent' : 'white', index: 10 })} />
            <View style={styles.progressBar({ width: calculatePercentage(seekableDuration, currentTime), color: showPanel ? 'transparent' : 'red', index: 11 })} />
        </View>)
    }

    render() {
        let { currentTrack, isFullscreen, play, rate, showMenu, showPanel } = this.state;
        let { resizeMode, showBottomProgresssBar, skipLimit = 0, data = [] } = this.props;

        return (
            <SafeAreaView style={{ backgroundColor: 'black' }}>
                <StatusBar hidden />
                {/* <StatusBar barStyle='light-content' translucent backgroundColor='rgba(0,0,0,0.7)' hidden={!!(!showPanel && isFullscreen)} /> */}
                {!!data.length && <View>
                    <View style={{ height: '100%' }}>
                        <Video
                            onEnd={this._onVideoEnd}
                            onLoad={(e) => this._toggleLoad(false, e)}
                            onLoadStart={(e) => this._toggleLoad(true, e)}
                            onProgress={({ currentTime, playableDuration, seekableDuration }) => {
                                this.setState({ playableDuration, seekableDuration, currentTime })
                                if(this.props.onPlayingVideo) {
                                    this.props.onPlayingVideo({ currentTime, playableDuration, seekableDuration })
                                }
                            }}
                            paused={!play}
                            rate={rate}
                            ref={ref => this.player = ref}
                            resizeMode={resizeMode}
                            source={data[currentTrack]}
                            style={styles.videoPlayerStyle}
                        />
                        {this._renderControlPanel()}
                    </View>
                    {showBottomProgresssBar && this._renderTrackProgressBar()}
                </View>}
                <Menu
                    onClose={() => this.setState({ showMenu: false })}
                    visible={showMenu}
                />

            </SafeAreaView >
        );
    }
}

const styles = StyleSheet.create({
    videoPlayerStyle: {
        backgroundColor: 'black',
        flex: 1,
    },
    panelContainer: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        // zIndex: 9999999,
        top: 0,
    },
    timerContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    controlButtonsContainer: {
        alignItems: 'center',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    buttonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
    },
    panelTopContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingRight: 10,
        paddingTop: 5,
        zIndex: 9999999,
    },
    title: {
        color: 'white',
        flex: 1,
        fontSize: 15,
        paddingHorizontal: 10,
        fontWeight: 'bold',
    },
    progressBar: ({ width, index, color }) => ({
        backgroundColor: color,
        bottom: 0,
        height: 2.5,
        left: 0,
        position: 'absolute',
        right: 0,
        width: width,
        zindex: index,
    })
});