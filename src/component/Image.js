import React from 'react';
import ImageUploader from 'react-images-upload';
 
class Image extends React.Component {
 
    constructor(props) {
        super(props);
         this.state = { pictures: [] };
        //  this.onDrop = this.onDrop.bind(this);
    }
 
    onDrop(picture) {
        // console.log(picture)
        this.setState({
            pictures: this.state.pictures.concat(picture),
            
            
        });
        this.props.fileData(picture);
    }
 
    render() {
        return (
            <ImageUploader
                withIcon={true}
                buttonText='Choose images'
                onChange={(e)=>this.onDrop(e)}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
            />
        );
    }
}
export default Image;