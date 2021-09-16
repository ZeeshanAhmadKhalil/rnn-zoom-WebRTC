import React, {
  Component
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals
} from 'react-native-webrtc';

import { connect } from 'react-redux'
import { joinRoom } from './src/store/actions/videoActions'

const height = Dimensions.height
const width = Dimensions.width

class App extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    let isFront = true;
    mediaDevices.enumerateDevices().then(sourceInfos => {
      // //console.log(sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 640,
          height: 480,
          frameRate: 30,
          facingMode: (isFront ? "user" : "environment"),
          deviceId: videoSourceId
        }
      })
        .then(stream => {
          //console.log('joining room')
          this.props.joinRoom(stream)
        })
        .catch(error => {
          //console.log('webRTC error ' + error)
        });
    });
  }
  render() {
    const { myStream, streams } = this.props.video
    //console.log(streams)
    return (
      <View style={styles.mainContainer}>
        <View style={styles.remoteStreamView}>
          {this.props.video.myStream &&
            <RTCView
              streamURL={this.props.video.myStream.toURL()}
              style={{ width: '100%', flex: 1 }}
              objectFit="cover"
            />
          }
        </View>
        <View style={styles.localStreamView}>
          {streams.length > 0 &&
            <RTCView
              streamURL={this.props.video.streams[0].toURL()}
              style={{ width: '100%', flex: 1 }}
              objectFit="cover"
            />
          }
        </View>
      </View>
    )
  }
}

const mapStateToProps = ({ video }) => ({
  video,
})

export default connect(mapStateToProps, { joinRoom })(App)

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flex: 1,
    backgroundColor: "silver",
  },
  remoteStreamView: {
    display: "flex",
    flex: 1,
    backgroundColor: "yellow",
  },
  localStreamView: {
    display: "flex",
    flex: 1,
    backgroundColor: "green"
  }
})