import React, {useState} from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { Form, Modal } from "react-bootstrap";
import SettingsButton from "../components/settings-button";
import CloseButton from "../components/close-button";
import ResponsiveSize from "../hooks/responsive-size";
import ResponsiveHeader from "../components/responsive-header";
import { textVide } from 'text-vide';
import RangeSlider from 'react-bootstrap-range-slider';

function SettingsWindow(props) {
  const [show, setShow] = useState(false);
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return(
    <>
    <SettingsButton fontButtonSize={ResponsiveSize(0.8, "rem", 0.001, 500)} handleShow={handleShow} />
    <Modal show={show} onHide={handleClose} fullscreen={true} scrollable={true}>
        <Modal.Header className="justify-content-center">
          <Modal.Title style={{color: "#017BFF"}}>
            <ResponsiveHeader level={1} maxSize={2} minScreenSize={500}>Settings</ResponsiveHeader>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <section className="mb-3">
            <div className='align-items-center' style={{textAlign: 'center', color: "#017BFF"}}>
              <ResponsiveHeader level={2} maxSize={1.5} minScreenSize={500}>
                Language and Dialogue
              </ResponsiveHeader>
            </div>
            <Form.Select style={{color: "#017BFF"}} className="hover-shadow" id="language-selector" onChange={props.changeLanguage} value={props.state.currentLanguage}>
              {props.languageOptions}
            </Form.Select>
          </section>
          <section className="mb-3">
              <div className='align-items-center' style={{textAlign: 'center', color: "#017BFF"}}>
                <ResponsiveHeader level={2} maxSize={1.5} minScreenSize={500}>
                  Mode
                </ResponsiveHeader>
              </div>
            <Form.Select style={{color: "#017BFF"}} className="hover-shadow" id="mode-selector" onChange={props.changeMode} value={props.state.currentMode}>
              {props.modeOptions}
            </Form.Select>
          </section>
          <section className="mb-3">
              <div className='align-items-center' style={{textAlign: 'center', color: "#017BFF"}}>
                <ResponsiveHeader level={2} maxSize={1.5} minScreenSize={500}>
                  Table Background
                </ResponsiveHeader>
              </div>
            <Form.Select style={{color: "#017BFF"}} className="hover-shadow" id="table-background-selector" onChange={props.changeTableBackground} value={props.state.currentTableBackground}>
              {['Zene', 'Zeanne', 'Classroom Table'].map((value) => (<option key={value}>{value}</option>))}
            </Form.Select>
          </section>
          <section className="mb-3">
          <div className='align-items-center pb-3' style={{textAlign: 'center', color: "#017BFF"}}>
            <ResponsiveHeader level={2} maxSize={1.5} minScreenSize={500}>{`Bionic Reading Level`}</ResponsiveHeader>
          </div>
          <RangeSlider className="hover-shadow mt-3" variant="dark" tooltipPlacement='top' tooltip='on' onChange={changeEvent => props.changeBionicReadingFixation(changeEvent.target.value)} min={0} max={5} value={props.state.currentBionicReadingFixationIndex} />
        </section>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <CloseButton handleClose={handleClose} />
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default class WordpressBlogv2022_2 extends React.Component {
  state = {
    currentLanguage: 'English',
    currentMode: 'Original',
    currentTableBackground: "Zene",
    currentSize: 65,
    currentBionicReadingFixationIndex: 0,
    currentBionicReadingFixation: 0
  }

  changeLanguage = () => {
    var language = document.getElementById("language-selector").value;
    this.setState({currentLanguage: language});
  }

  changeMode = () => {
    var mode = document.getElementById("mode-selector").value;
    this.setState({currentMode: mode});
  }

  changeTableBackground = () => {
    var tableBackground = document.getElementById("table-background-selector").value;
    this.setState({currentTableBackground: tableBackground});
  }
  
  changeBionicReadingFixation = (bionicReadingFixationRaw) => {
    switch(parseInt(bionicReadingFixationRaw)) {
      case 1:
        this.setState({currentBionicReadingFixation: 5});
        break;
      case 2:
        this.setState({currentBionicReadingFixation: 4});
        break;
      case 3:
        this.setState({currentBionicReadingFixation: 1});
        break;
      default:
        this.setState({currentBionicReadingFixation: 0});
    }

    this.setState({currentBionicReadingFixationIndex: parseInt(bionicReadingFixationRaw)});
  }

  render() {
    var metadataItems = null;
    var images = [];
    var texts = [];
    var imagesAlt = [];
    var currentLanguageCode = `en`;
    var languages = new Set();
    for(var i = 0; i < this.props.data.allFile.edges.length; i++) {
      var nodeItem = this.props.data.allFile.edges[i].node

      if(nodeItem.relativeDirectory.includes("images") && nodeItem.ext === ".png") {
        images.push(nodeItem);
      }
      if(nodeItem.relativeDirectory.includes("text") && nodeItem.ext === ".md") {
        languages.add(nodeItem.relativeDirectory.split("/")[nodeItem.relativeDirectory.split("/").length - 1])
        if(nodeItem.relativeDirectory.includes("text/" + this.state.currentLanguage.split("-")[0])) {
          if(nodeItem.name === "image-alt") {
            imagesAlt = nodeItem.childMarkdownRemark.frontmatter.image_alt
            currentLanguageCode = nodeItem.childMarkdownRemark.frontmatter.language_code
          }
          else {
            texts.push(nodeItem);
          }
        }
      }
      else if(nodeItem.ext === ".md" && nodeItem.name === "index") {
        metadataItems = nodeItem;
      }
    }

    var languageOptions = []
    languages.forEach((value) => {
      languageOptions.push(<option key={value}>{value}</option>)
    })

    var modeOptions = []
    var callAt = []
    metadataItems.childMarkdownRemark.frontmatter.modes.forEach((mode) => {
      modeOptions.push(<option key={mode.mode_name}>{mode.mode_name}</option>)
      if(mode.mode_name === this.state.currentMode) {
        callAt = mode.call_at;
      }
    })

    var sections = [];
    var sectionNum = 0;
    var maxSectionNum = Math.max(parseInt(images[images.length - 1].name), parseInt(texts[texts.length - 1].name));
    var currentImage = (<section aria-hidden={true}></section>);
    var currentText = null;
    var nextTextID = 0;
    var nextImageID = 0;
    var callAtIndex = 0;
    while(sectionNum <= maxSectionNum && callAtIndex < callAt.length) {
      if(nextTextID < texts.length && parseInt(texts[nextTextID].name) === sectionNum) {
        var currentTextHTML = texts[nextTextID].childMarkdownRemark.html;
        if(this.state.currentBionicReadingFixation > 0) {
          if(metadataItems.childMarkdownRemark.frontmatter.version === 4) {
            currentTextHTML = textVide(currentTextHTML, { fixationPoint: this.state.currentBionicReadingFixation });
          }
          else {
            const anchorStartTagRegex = /<a.*">/gi
            const anchorEndTagRegex = /<\/a>/gi
            console.log(currentTextHTML)
            currentTextHTML = currentTextHTML.replace(anchorStartTagRegex, "")
            currentTextHTML = currentTextHTML.replace(anchorEndTagRegex, "")
            currentTextHTML = textVide(currentTextHTML, { sep: ['<span style="color: #A35BFF">', '</span>'], fixationPoint: (![2, 3].includes(this.state.currentBionicReadingFixation)) ? this.state.currentBionicReadingFixation : 1 });
          }
        }
        currentText = (<section className="my-2" dangerouslySetInnerHTML={{ __html: currentTextHTML }}></section>);
        nextTextID++;
      }

      if(nextImageID < images.length && parseInt(images[nextImageID].name) === sectionNum) {
        currentImage = (
          <section className="my-2 center-image">
            <img style={{maxWidth: "60%"}} alt={imagesAlt[sectionNum]} src={images[nextImageID].publicURL} />
          </section>
        );
        nextImageID++;
      }

      if(sectionNum === callAt[callAtIndex]) {
        sections.push(currentImage)
        sections.push(currentText)
        callAtIndex++;
      }

      sectionNum++;
    }

    return(
      <Layout menuBarItems={[(<SettingsWindow state={this.state} version={metadataItems.childMarkdownRemark.frontmatter.version} languageOptions={languageOptions} modeOptions={modeOptions} changeLanguage={this.changeLanguage} changeMode={this.changeMode} changeTableBackground={this.changeTableBackground} changeBionicReadingFixation={this.changeBionicReadingFixation} />)]} showMenuBar={true}>
      <section className={"table-background-" + this.state.currentTableBackground.toLowerCase().replace(/ /g, "-")}>
        <div className={`p-3 wordpress-v2022_2`}>
        <div style={{textAlign: "center"}}>
          <ResponsiveHeader level={1} maxSize={2} minScreenSize={800}>
            {metadataItems.childMarkdownRemark.frontmatter.title}
          </ResponsiveHeader>
        </div>
        <article lang={currentLanguageCode} className={`m-3`} style={{textAlign: "justify"}}>
          {sections}
        </article>
        </div>
      </section>
      </Layout>
    )
  }
}

export const query = graphql`
query {
  allFile(
    filter: {relativeDirectory: {regex: "/assets/*/"}}
    sort: {relativePath: ASC}
  ) {
    edges {
      node {
        name
        ext
        relativeDirectory
        publicURL
        childMarkdownRemark {
          html
          frontmatter {
            title
            image_alt
            language_code
            modes {
              mode_name
              call_at
            }
            version
          }
        }
      }
    }
  }
}
`