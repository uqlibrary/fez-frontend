import React, {PureComponent} from 'react';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {withStyles} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import TextField from '@material-ui/core/TextField';
import Hidden from '@material-ui/core/Hidden';
import Keyboard from '@material-ui/icons/Keyboard';
import {HelpIcon} from 'modules/SharedComponents/Toolbox/HelpDrawer';
import withWidth from '@material-ui/core/withWidth';
import Badge from '@material-ui/core/Badge';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import DownshiftMultiple from 'modules/Admin/components/MultiSelectWithChip';

import Cookies from 'js-cookie';

const styles = theme => ({
    helpIcon: {
        color: theme.palette.secondary.main,
        opacity: 0.66,
        '&:hover': {
            opacity: 0.87
        }
    },
    tabIndicator: {
        height: 4,
        backgroundColor: theme.palette.primary.main
    },
    badgeMargin: {
        top: 8,
        left: 28,
        width: 12, height: 12,
        fontSize: 10,
        fontWeight: 'bold',
        backgroundColor: '#595959'
    }
});

class Admin extends PureComponent {
    static propTypes = {
        account: PropTypes.object,
        author: PropTypes.object,
        actions: PropTypes.object,
        location: PropTypes.object,
        history: PropTypes.object.isRequired,
        classes: PropTypes.object,
        width: PropTypes.any,
        theme: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            tabbed: Cookies.get('adminFormTabbed') ? !!(Cookies.get('adminFormTabbed') === 'tabbed') : true,
            tabValue: 0,
            collection: [],
            security: {
                value: '',
                confirmed: false
            }
        };
    }

    componentWillMount() {
        if (this.props.width === 'xs') {
            this.setState({
                ...this.state,
                tabbed: false
            });
            Cookies.set('adminFormTabbed', 'fullform');
        }
    }

    handleTabChange = (event, value) => {
        this.setState({...this.state, tabValue: value});
    };

    handleSecuritySelectChange = (event) => {
        this.setState({
            ...this.state,
            security: {
                value: event.target.value
            }
        });
    };

    handleSecurityConfirmChange = () => {
        this.setState({
            ...this.state,
            security: {
                ...this.state.security,
                confirmed: !this.state.security.confirmed
            }
        });
    };

    handleFormatChange = () => {
        this.setState({tabbed: !this.state.tabbed }, () => {
            Cookies.set('adminFormTabbed', this.state.tabbed ? 'tabbed' : 'fullform');
        });
    };

    handleKeyEvent = (key) => {
        switch (key) {
            case 'ctrl+shift+left':
                this.state.tabValue > 0 && this.setState({
                    ...this.state,
                    tabValue: this.state.tabValue - 1
                });
                break;
            case 'ctrl+shift+right':
                this.state.tabValue < 5 && this.setState({
                    ...this.state,
                    tabValue: this.state.tabValue + 1
                });
                break;
            case 'ctrl+shift+up':
                this.setState({
                    ...this.state,
                    tabbed: true
                });
                break;
            case 'ctrl+shift+down':
                this.setState({
                    ...this.state,
                    tabbed: false
                });
                break;
            default:
                break;
        }
    };

    handleInputValue = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleMultiChipData = (name, data) => {
        this.setState({
            [name]: data
        });
    };

    render() {
        console.log(this.state);
        const { classes } = this.props;
        const PIDtitle = 'UQ:12345 Uncoupling of the Pdc-Treg Crosstalk During Early-Life Pneumovirus Infection Underlies Long-Lived Treg Dysfunction and Asthma Development';
        const collectionItems = [
            { value: 'UQ:120743', label: '16th Australasian Fluid Mechanics Conference'},
            { value: 'UQ:217410', label: '2004 Higher Education Research Data Collection'},
            { value: 'UQ:217419', label: '2005 Higher Education Research Data Collection'},
            { value: 'UQ:217422', label: '2006 Higher Education Research Data Collection'},
            { value: 'UQ:217423', label: '2007 Higher Education Research Data Collection'},
            { value: 'UQ:23835', label: '2008 Higher Education Research Data Collection'},
            { value: 'UQ:138536', label: '2009 Higher Education Research Data Collection'},
            { value: 'UQ:174061', label: '2010 Higher Education Research Data Collection'},
            { value: 'UQ:276026', label: '2012 University of Queensland Bachelor of Arts Review'},
            { value: 'UQ:131735', label: '5th Australasian Congress on Applied Mechanics'},
            { value: 'UQ:290441', label: '6th International Conference of Animal Health Information Specialists (ICAHIS) 2009'},
            { value: 'UQ:318429', label: '7th International Conference of Animal Health Information Specialists (ICAHIS) 2013'},
            { value: 'UQ:151282', label: 'A National Entomology Curriculum for Australia Project (A project funded by the Carrick Institute)'},
            { value: 'UQ:11398', label: 'Aboriginal and Torres Strait Islander Studies Unit Publications'},
            { value: 'UQ:11404', label: 'Aboriginal Environments Research Centre Publications'},
            { value: 'UQ:131375', label: 'Adaptive Interactive Profit Expectations'},
            { value: 'UQ:677352', label: 'Admin Only - Centre for Health Services Research'},
            { value: 'UQ:292807', label: 'Admin only - CHRC'},
            { value: 'UQ:599496', label: 'Admin Only - Ochsner Clinical School'},
            { value: 'UQ:599489', label: 'Admin Only - Rural Clinical School'},
            { value: 'UQ:677353', label: 'Admin Only - School of Biomedical Sciences'},
            { value: 'UQ:599487', label: 'Admin Only - School of Clinical Medicine'},
            { value: 'UQ:273541', label: 'Admin Only - School of Medicine'},
            { value: 'UQ:677355', label: 'Admin Only - School of Public Health'},
            { value: 'UQ:677356', label: 'Admin Only - UQ Diamantina Institute'},
            { value: 'UQ:408041', label: 'Admin Only - UQCCR'},
            { value: 'UQ:7557', label: 'Advanced Computational Modelling Centre Publications'},
            { value: 'UQ:7565', label: 'Advanced Water Management Centre Publications'},
            { value: 'UQ:212969', label: 'AEDA Publications'},
            { value: 'UQ:353000', label: 'Ahrens, Prue and Helmrich, Michele and Whitlock, Gillian - Waiting for Asylum and Collaborative Witness: Two Curated Public Exhibitions'},
            { value: 'UQ:23914', label: 'Antiquities Museum'},
            { value: 'UQ:209865', label: 'Archive CD Books (Open Access)'},
            { value: 'UQ:381162', label: 'Archive CD Books (UQ Staff and Students only)'},
            { value: 'UQ:290315', label: 'Art Forms in Brisbane'},
            { value: 'UQ:224604', label: 'Assessment policy and impact on practice – sharpening the policy review process in Australian universities'},
            { value: 'UQ:287231', label: 'Assets, Ageing and Intergenerational Transfers Publications'},
            { value: 'UQ:12837', label: 'ATCH (Architecture Theory History Criticism) Publications'},
            { value: 'UQ:180046', label: 'Aus-e-Lit'},
            { value: 'UQ:195447', label: 'Aust Dict of Biography'},
            { value: 'UQ:120136', label: 'AustLit Publications'},
            { value: 'UQ:7541', label: 'Australasian Centre on Ageing Publications'},
            { value: 'UQ:7561', label: 'Australian Centre for Complementary Medicine, Education and Research Publications'},
            { value: 'UQ:253506', label: 'Australian Centre for Ecogenomics'},
            { value: 'UQ:201165', label: 'Australian Centre for International &amp; Tropical Health'},
            { value: 'UQ:7567', label: 'Australian Centre for Minerals Extension and Research Publications'},
            { value: 'UQ:649', label: 'Australian Drama Project'},
            { value: 'UQ:7555', label: 'Australian Equine Genetics Research Centre Publications'},
            { value: 'UQ:3860', label: 'Australian Institute for Bioengineering and Nanotechnology Publications'},
            { value: 'UQ:351119', label: 'Australian Institute for Business and Economics'},
            { value: 'UQ:124204', label: 'Australian Literature Teaching Survey (Private Research Collection)'},
            { value: 'UQ:12816', label: 'Australian Newspaper History Group Newsletter Archive'},
            { value: 'UQ:119942', label: 'Australian Popular Theatre'},
            { value: 'UQ:7581', label: 'Australian Studies Centre Publications'},
            { value: 'UQ:152846', label: 'Bachelor of Science Curriculum Review'},
            { value: 'UQ:350647', label: 'Barikin, Amelia - Large Screens and the Transnational Public Sphere: Curating for Public Spaces'},
            { value: 'UQ:195451', label: 'Blackwell Companions'},
            { value: 'UQ:219664', label: 'Brisbane City'},
            { value: 'UQ:288818', label: 'Brisbane Suburbs'},
            { value: 'UQ:7578', label: 'Brisbane Surface Analysis Facility Publications'},
            { value: 'UQ:719686', label: 'Brown, Shaun - Baritone vocal issues in dramatic repertoire'},
            { value: 'UQ:350401', label: 'Butler, Rex - Art after deconstruction'},
            { value: 'UQ:696704', label: 'Butler, Rex - Contemporary Art Writing and Criticism'},
            { value: 'UQ:350566', label: 'Butler, Sally - Contemporary Queensland Art and Exhibitions'},
            { value: 'UQ:350564', label: 'Butler, Sally - Documenting Contemporary Indigenous Artists: Catalogue Entries'},
            { value: 'UQ:218718', label: 'CAI Human Instrument Imaging Publications'},
            { value: 'UQ:195450', label: 'Cambridge Companions and Handbks Series'},
            { value: 'UQ:170742', label: 'Cancer Prevention Research Centre Publications'},
            { value: 'UQ:292856', label: 'Cane Toad Times'},
            { value: 'UQ:720609', label: 'Carleton, Stephen – Bastard Territory: identity formation, belonging, and culturally diverse families'},
            { value: 'UQ:720608', label: 'Carleton, Stephen – The Turquoise Elephant: contemporary political farce and ecological challenges'},
            { value: 'UQ:3521', label: 'Carter Brown Book Covers'},
            { value: 'UQ:23694', label: 'Catalyst Centre Publications'},
            { value: 'UQ:23606', label: 'Catalyst Writing Syndicate'},
            { value: 'UQ:213093', label: 'CEED Publications'},
            { value: 'UQ:3927', label: 'Centre for Advanced Imaging Publications'},
            { value: 'UQ:351429', label: 'Centre for Ageing Dementia Research Publications'},
            { value: 'UQ:151317', label: 'Centre for Bacterial Diversity and Identification Publications'},
            { value: 'UQ:351071', label: 'Centre for Coal Seam Gas'},
            { value: 'UQ:3913', label: 'Centre for Critical and Cultural Studies Publications'},
            { value: 'UQ:410769', label: 'Centre for eLearning Innovations and Partnerships in Science and Engineering (eLIPSE) - Test Collection'},
            { value: 'UQ:677351', label: 'Centre for Health Services Research Publications'},
            { value: 'UQ:7553', label: 'Centre for Integrated Preclinical Drug Development Publications'},
            { value: 'UQ:137139', label: 'Centre for Integrative Legume Research Publications'},
            { value: 'UQ:7534', label: 'Centre for Marine Studies Publications'},
            { value: 'UQ:3919', label: 'Centre for Microscopy and Microanalysis Publications'},
            { value: 'UQ:7559', label: 'Centre for Military and Veterans` Health Publications'},
            { value: 'UQ:11397', label: 'Centre for Mined Land Rehabilitation Publications'},
            { value: 'UQ:7536', label: 'Centre for Nanotechnology and Biomaterials Publications'},
            { value: 'UQ:351430', label: 'Centre for Neurogenetics and Statistical Genomics Publications'},
            { value: 'UQ:7549', label: 'Centre for Nutrition and Food Sciences Publications'},
            { value: 'UQ:3925', label: 'Centre for Online Health Publications'},
            { value: 'UQ:151964', label: 'Centre for Organic Photonics and Electronics'},
            { value: 'UQ:177161', label: 'Centre for Quantum Computer Technology Publications'},
            { value: 'UQ:340262', label: 'Centre for Research in Geriatric Medicine Publications'},
            { value: 'UQ:7575', label: 'Centre for Research in Vascular Biology Publications'},
            { value: 'UQ:7539', label: 'Centre for Social Research in Communication - Publications'},
            { value: 'UQ:135607', label: 'Centre for Social Responsibility in Mining Publications'},
            { value: 'UQ:3915', label: 'Centre for the History of European Discourses Publications'},
            { value: 'UQ:7569', label: 'Centre for Theoretical and Computational Molecular Science - Publications'},
            { value: 'UQ:195157', label: 'Centre for Water in the Minerals Industry'},
            { value: 'UQ:351431', label: 'Centre for Youth Substance Abuse Research Publications'},
            { value: 'UQ:347699', label: 'Chalabi, Adam - Curating and Conducting from the Orchestra: the Mostly Mozart Concert Series'},
            { value: 'UQ:717272', label: 'Chalabi, Adam - Interdisciplinary Creative Collaboration: string quartet withspoken voice and songwriting'},
            { value: 'UQ:717770', label: 'Chalabi, Adam - New Insights into Early String Quartet Writing: Tinalley and Haydn Opus 20'},
            { value: 'UQ:717769', label: 'Chalabi, Adam - String Quartet Performance Practice: Tinalley and the Australian String Quartet'},
            { value: 'UQ:284159', label: 'Charles Rennie Mackintosh'},
            { value: 'UQ:387775', label: 'Child Health Research Centre Publications'},
            { value: 'UQ:7573', label: 'Clinical Medical Virology Centre Publications'},
            { value: 'UQ:12787', label: 'Contemporary Pacific Art'},
            { value: 'UQ:639325', label: 'Crossref Import'},
            { value: 'UQ:398846', label: 'Curated Collection: Brisbane Floods 1893'},
            { value: 'UQ:398847', label: 'Curated Collection: First World War'},
            { value: 'UQ:415754', label: 'Curated Collection: UQ Then and Now'},
            { value: 'UQ:422941', label: 'Curated Collection: Vietnam War'},
            { value: 'UQ:352152', label: 'Davidson, Robert - Beyond Style: Creative Collaboration across Boundaries'},
            { value: 'UQ:266584', label: 'Davidson, Robert - Composition and performance using mixed-methodology collaboration'},
            { value: 'UQ:352136', label: 'Davidson, Robert - Indie-Classical: new developments in chamber, choral and orchestral composition'},
            { value: 'UQ:266585', label: 'Davidson, Robert - Voice portraiture compositions, performances and investigations'},
            { value: 'UQ:351906', label: 'de Manincor, John - Criticism and Writing'},
            { value: 'UQ:13625', label: 'Degnan Laboratory'},
            { value: 'UQ:195454', label: 'Dictionary of the Middle Ages'},
            { value: 'UQ:167709', label: 'Discipline of General Practice Publications'},
            { value: 'UQ:13197', label: 'Discussion Papers (School of Economics)'},
            { value: 'UQ:185193', label: 'Dissemination of Triple P'},
            { value: 'UQ:423120', label: 'Dorothy Hill Collection, School of Earth and Environmental Sciences'},
            { value: 'UQ:265484', label: 'Duwell, Martin - Australian Poetry Review'},
            { value: 'UQ:7563', label: 'Earth Systems Science Computational Centre Publications'},
            { value: 'UQ:3923', label: 'Ecology Centre Publications'},
            { value: 'UQ:13201', label: 'Economic Issues (School of Economics)'},
            { value: 'UQ:195456', label: 'Encyclopedias of Philosophy'},
            { value: 'UQ:178038', label: 'Enhanced Triple P'},
            { value: 'UQ:247427', label: 'ERA 2010 Peer Reviewed'},
            { value: 'UQ:254105', label: 'ERA 2012 Admin Only'},
            { value: 'UQ:256976', label: 'ERA White List Items'},
            { value: 'UQ:179580', label: 'ERE: Environmental Research Event 2009'},
            { value: 'UQ:152010', label: 'eResearch Australasia 2008'},
            { value: 'UQ:186782', label: 'eResearch Australasia 2009'},
            { value: 'UQ:12863', label: 'eScholarshipUQ Project'},
            { value: 'UQ:237927', label: 'eSpace Followup'},
            { value: 'UQ:152266', label: 'Excellence in Research Australia (ERA) - Collection'},
            { value: 'UQ:12334', label: 'Faculty of Business, Economics and Law -- Publications'},
            { value: 'UQ:13075', label: 'Faculty of Business, Economics and Law -- Student Publications'},
            { value: 'UQ:13076', label: 'Faculty of Engineering, Architecture and Information Technology -- Student Publications'},
            { value: 'UQ:12335', label: 'Faculty of Engineering, Architecture and Information Technology Publications'},
            { value: 'UQ:12336', label: 'Faculty of Health and Behavioural Sciences -- Publications'},
            { value: 'UQ:13078', label: 'Faculty of Health and Behavioural Sciences -- Student Publications'},
            { value: 'UQ:11599', label: 'Faculty of Humanities and Social Sciences - Publications'},
            { value: 'UQ:13080', label: 'Faculty of Humanities and Social Sciences -- Student Publications'},
            { value: 'UQ:335740', label: 'Faculty of Medicine'},
            { value: 'UQ:12332', label: 'Faculty of Science Publications'},
            { value: 'UQ:13074', label: 'Faculty of Science Student Publications'},
            { value: 'UQ:178040', label: 'Family Transitions Triple P'},
            { value: 'UQ:361219', label: 'Finding Aids (test)'},
            { value: 'UQ:12339', label: 'Former UQ Staff and Postgraduate Students` Publications'},
            { value: 'UQ:197383', label: 'Fryer Ephemera collection'},
            { value: 'UQ:278419', label: 'Fryer Library'},
            { value: 'UQ:413806', label: 'Fryer Library (metadata only)'},
            { value: 'UQ:361995', label: 'Fryer Library (Restricted)'},
            { value: 'UQ:725423', label: 'Fryer Library manuscript permissions, copyright etc (Restricted)'},
            { value: 'UQ:173829', label: 'Fryer Library Pictorial Collection'},
            { value: 'UQ:151519', label: 'Fryer Library University of Queensland Photograph Collection'},
            { value: 'UQ:717792', label: 'Furphy, Susana - Portfolio of short creative works in Spanish'},
            { value: 'UQ:195152', label: 'Global Change Institute Publications'},
            { value: 'UQ:267313', label: 'Glover, Stuart - Short pieces on the state of the publishing industry'},
            { value: 'UQ:3585', label: 'Gooreng Gooreng Cultural Heritage Project'},
            { value: 'UQ:219124', label: 'Graduate Certificate in Higher Education'},
            { value: 'UQ:352070', label: 'Grinberg, Anna - Reclaiming Lost Expressive Devices in Romantic and Early Modern Chamber Music'},
            { value: 'UQ:178041', label: 'Group Triple P'},
            { value: 'UQ:177957', label: 'Healthy Communities Research Centre Publications'},
            { value: 'UQ:697984', label: 'Helmrich, Michele - Curating Australian Art'},
            { value: 'UQ:218311', label: 'HERDC Pre-Audit'},
            { value: 'UQ:621523', label: 'Heron Island Research Station Images'},
            { value: 'UQ:199359', label: 'High Performance Computing Publications'},
            { value: 'UQ:328950', label: 'Hydraulic Structures and Society - Engineering Challenges and Extremes: Proceedings of the 5th IAHR International Symposium on Hydraulic Structures (ISHS2014)'},
            { value: 'UQ:357492', label: 'Indigenous Languages recorded in the Queensland Speech Survey (open)'},
            { value: 'UQ:357493', label: 'Indigenous Languages recorded in the Queensland Speech Survey (secure)'},
            { value: 'UQ:178042', label: 'Indigenous Triple P'},
            { value: 'UQ:374917', label: 'Institute for Advanced Studies in the Humanities'},
            { value: 'UQ:3858', label: 'Institute for Molecular Bioscience - Publications'},
            { value: 'UQ:151785', label: 'Institute for Social Science Research - Publications'},
            { value: 'UQ:361428', label: 'Institute for Teaching and Learning Innovation Publications'},
            { value: 'UQ:152014', label: 'Institute of Modern Languages - Publications'},
            { value: 'UQ:396582', label: 'International Conference on Performance-based and Life-cycle Structural Engineering (PLSE)'},
            { value: 'UQ:351990', label: 'Jacobs, Jason - Explorations in Screen Aesthetics: Blogs for Critical Studies in Television'},
            { value: 'UQ:718134', label: 'Janaczewska, Noelle - Contemporary Playwrighting Exposing Historical Gaps'},
            { value: 'UQ:127516', label: 'Journal Article Import (ISI/CVs)'},
            { value: 'UQ:11401', label: 'Julius Kruttschnitt Mineral Research Centre Publications'},
            { value: 'UQ:722737', label: 'Kaempf, Sebastian - Exploring the intersection between information technology, global media, and violent conflict'},
            { value: 'UQ:347687', label: 'Kaji-O`Grady, Sandra - Critical Writing'},
            { value: 'UQ:27', label: 'Kangaroo Populations of Eastern Australia - Ecology and Management'},
            { value: 'UQ:7545', label: 'Key Centre for Human Factors and Applied Cognitive Psychology - Publications'},
            { value: 'UQ:347689', label: 'Keys, Catherine - Ceramics and Visual Arts'},
            { value: 'UQ:720254', label: 'Klein, Eve - Body Inscriptions: Layering Site and Audience Histories in Performance Works (2013-2015)'},
            { value: 'UQ:720251', label: 'Lea, Bronwyn - Bronwyn Lea collection of poems'},
            { value: 'UQ:350332', label: 'Lea, Bronwyn - Literary Journalism: Reviews and Commentary'},
            { value: 'UQ:178033', label: 'Level 1 Evidence'},
            { value: 'UQ:178034', label: 'Level 2 Evidence'},
            { value: 'UQ:178035', label: 'Level 3 Evidence'},
            { value: 'UQ:178036', label: 'Level 4 Evidence'},
            { value: 'UQ:178037', label: 'Level 5 Evidence'},
            { value: 'UQ:361983', label: 'Life Course Centre Working Papers Series'},
            { value: 'UQ:178043', label: 'Lifestyle Triple P'},
            { value: 'UQ:238624', label: 'LTS Testing Collection'},
            { value: 'UQ:400974', label: 'LTS Testing Copy'},
            { value: 'UQ:152776', label: 'MAPS Identity Management Workshop and Working Group'},
            { value: 'UQ:375313', label: 'Marks-Hirschfeld Museum of Medical History'},
            { value: 'UQ:719555', label: 'Martin, Richard et al. - Applied Anthropological Research on Australian Indigenous Land Claims and Cultural Heritage. Series A'},
            { value: 'UQ:719562', label: 'Martin, Richard et al. - Applied Anthropological Research on Australian Indigenous Land Claims and Cultural Heritage. Series B'},
            { value: 'UQ:212974', label: 'MARXAN Publications'},
            { value: 'UQ:13601', label: 'Mater Health Services Publications'},
            { value: 'UQ:13602', label: 'Mater Research Institute-UQ (MRI-UQ)'},
            { value: 'UQ:111028', label: 'Mater-University of Queensland Study of Pregnancy'},
            { value: 'UQ:350222', label: 'Maynard, Margaret - Queensland Fashion, 1859-Present'},
            { value: 'UQ:219034', label: 'MBA reports'},
            { value: 'UQ:716791', label: 'McWilliam, Janette et al. - RD Milns Antiquities Museum'},
            { value: 'UQ:3586', label: 'Mill Point Archaeological Project'},
            { value: 'UQ:167696', label: 'Minerals Industry Safety and Health Centre Publications'},
            { value: 'UQ:351835', label: 'Morton, Graeme - Developing an Apparatus for Engagement with Contemporary Choral Art Music'},
            { value: 'UQ:351857', label: 'Morton, Graeme - Establishing Relevance and Meaning in Choral Experience'},
            { value: 'UQ:351839', label: 'Morton, Graeme - Giving Voice to Australian Choral Music'},
            { value: 'UQ:351511', label: 'Morton, Graeme - Revisiting Performer - Creator Connectivity'},
            { value: 'UQ:267265', label: 'Murphy, Patrick - Analysis Through Performance: a Cellist’s Chamber Music Contribution'},
            { value: 'UQ:351795', label: 'Murphy, Patrick - Chamber Music in Collaboration with Theatre and Dance'},
            { value: 'UQ:352187', label: 'Murphy, Patrick - Solo Cello Performance: Constraints and Affordances'},
            { value: 'UQ:177479', label: 'National and Institutional Perspectives on Metrics-Based Research Evaluation'},
            { value: 'UQ:7551', label: 'National Research Centre for Environmental Toxicology Publications'},
            { value: 'UQ:213096', label: 'NERP Publications'},
            { value: 'UQ:195446', label: 'NHMRC reports'},
            { value: 'UQ:237156', label: 'Non HERDC'},
            { value: 'UQ:255125', label: 'Non-Traditional Research Outputs (individual items)'},
            { value: 'UQ:265382', label: 'Non-UQ Theses'},
            { value: 'UQ:676357', label: 'Not Yet Publicly Available'},
            { value: 'UQ:4002', label: 'Nursing Practice Development Unit Publications'},
            { value: 'UQ:264726', label: 'O`Loghlin, Michael - First Editions of Chamber Music Works of the Berlin School (1740-1770)'},
            { value: 'UQ:352071', label: 'O`Loghlin, Michael - Historically Informed Performances of Baroque Music'},
            { value: 'UQ:351913', label: 'O`Loghlin, Michael - Scholarly Introductions to Music Editions of Berlin School'},
            { value: 'UQ:599493', label: 'Ochsner Clinical School Publications'},
            { value: 'UQ:687847', label: 'Office of the Deputy Vice-Chancellor (External Engagement)'},
            { value: 'UQ:307389', label: 'Office of the Vice-Chancellor'},
            { value: 'UQ:228284', label: 'Official 2011 Collection'},
            { value: 'UQ:240423', label: 'Official 2012 Collection'},
            { value: 'UQ:247259', label: 'Official 2013 Collection'},
            { value: 'UQ:283553', label: 'Official 2014 Collection'},
            { value: 'UQ:320785', label: 'Official 2015 Collection'},
            { value: 'UQ:343251', label: 'Official 2016 Collection'},
            { value: 'UQ:383507', label: 'Official 2017 Collection'},
            { value: 'UQ:355780', label: 'Official Audit'},
            { value: 'UQ:727866', label: 'ORCID Author Back Catalogue'},
            { value: 'UQ:244548', label: 'Out of Circulation'},
            { value: 'UQ:693105', label: 'Out of circulation - suspected duplicate records'},
            { value: 'UQ:195452', label: 'Oxford and Cambridge Encyclopedias'},
            { value: 'UQ:195449', label: 'Oxford Companions and Handbks Series'},
            { value: 'UQ:195448', label: 'Oxford Dict of Nat Biography'},
            { value: 'UQ:23900', label: 'Parenting and Family Support Centre (Triple P) - Publications'},
            { value: 'UQ:178044', label: 'Pathways Triple P'},
            { value: 'UQ:718130', label: 'Pensalfini, Rob - Queensland Shakespeare Ensemble'},
            { value: 'UQ:352492', label: 'Pensalfini, Rob - Shakespeare Prison Project'},
            { value: 'UQ:351066', label: 'Personalised Nanomedicine Centre'},
            { value: 'UQ:690401', label: 'Photographs from the TC Beirne School of Law'},
            { value: 'UQ:124163', label: 'Poets on Record'},
            { value: 'UQ:257879', label: 'Pollett, Patricia - Creative Partnerships, Premieres and New Works involving Viola'},
            { value: 'UQ:257165', label: 'Pollett, Patricia - Original Interpretations, New Insights'},
            { value: 'UQ:717114', label: 'Potter, Warwick - Conducting Approaches in Youth and Community Orchestra Contexts'},
            { value: 'UQ:178045', label: 'Primary Care Triple P'},
            { value: 'UQ:179364', label: 'Proceedings of the 10th International Congress on Medical Librarianship (ICML) 2009'},
            { value: 'UQ:318428', label: 'Proceedings of the 11th International Congress on Medical Librarianship (ICML) 2013'},
            { value: 'UQ:287559', label: 'Professional Doctorates - Open Access'},
            { value: 'UQ:151710', label: 'Professional Doctorates - UQ staff and students only'},
            { value: 'UQ:13603', label: 'Project Management Collection'},
            { value: 'UQ:380877', label: 'Project Manta'},
            { value: 'UQ:688533', label: 'Pubmed Import'},
            { value: 'UQ:697520', label: 'PubMed Import - Archived'},
            { value: 'UQ:290198', label: 'QAAFI Biological Information Technology (QBIT) Publications'},
            { value: 'UQ:246627', label: 'Queensland Alliance for Agriculture and Food Innovation'},
            { value: 'UQ:541428', label: 'Queensland Alliance for Environmental Health Sciences (QAEHS) Publications'},
            { value: 'UQ:23912', label: 'Queensland Brain Institute Publications'},
            { value: 'UQ:179309', label: 'Queensland Centre for Health Data Services'},
            { value: 'UQ:398265', label: 'Queensland Cerebral Palsy and Rehabilitation Research Centre'},
            { value: 'UQ:335701', label: 'Queensland Children`s Medical Research Institute Publications'},
            { value: 'UQ:3903', label: 'Queensland Contemporary Architects'},
            { value: 'UQ:3683', label: 'Queensland Country Towns'},
            { value: 'UQ:23833', label: 'Queensland Historical Atlas'},
            { value: 'UQ:179407', label: 'Queensland Past Online (QPO)'},
            { value: 'UQ:3736', label: 'Radical Protest and Street Marches in Brisbane, 1960-1980'},
            { value: 'UQ:289097', label: 'Research Data Collections'},
            { value: 'UQ:299616', label: 'Research Data Collections - Admin'},
            { value: 'UQ:242914', label: 'Research Data Policy Reference Group'},
            { value: 'UQ:183940', label: 'ResearcherID Downloads'},
            { value: 'UQ:682195', label: 'ResearcherID Downloads - Archived'},
            { value: 'UQ:673633', label: 'Retracted publications'},
            { value: 'UQ:3929', label: 'Rotary Centre for International Studies in Peace and Conflict Resolution Publications'},
            { value: 'UQ:195453', label: 'Routledge Encyclopedias'},
            { value: 'UQ:195455', label: 'Routledge Worlds Series'},
            { value: 'UQ:163514', label: 'RRTD Excellence in Research Australia (ERA) 2 - Collection'},
            { value: 'UQ:599488', label: 'Rural Clinical School Publications'},
            { value: 'UQ:350595', label: 'Salisbury, Chris - Queensland Historical Atlas - Remaking the Queensland Political Landscape'},
            { value: 'UQ:350033', label: 'Salisbury, Christopher - Queensland Government Cabinet Minutes: Background and Decisions, 1979-1981'},
            { value: 'UQ:155729', label: 'SBS Professional Doctorates - UQ staff and students only'},
            { value: 'UQ:240731', label: 'School of Agriculture and Food Sciences'},
            { value: 'UQ:3804', label: 'School of Architecture Publications'},
            { value: 'UQ:3805', label: 'School of Biological Sciences Publications'},
            { value: 'UQ:3823', label: 'School of Biomedical Sciences Publications'},
            { value: 'UQ:195549', label: 'School of Chemical Engineering Publications'},
            { value: 'UQ:3825', label: 'School of Chemistry and Molecular Biosciences'},
            { value: 'UQ:195545', label: 'School of Civil Engineering Publications'},
            { value: 'UQ:599486', label: 'School of Clinical Medicine Publications'},
            { value: 'UQ:3803', label: 'School of Communication and Arts Publications'},
            { value: 'UQ:3808', label: 'School of Dentistry Publications'},
            { value: 'UQ:533111', label: 'School of Earth and Environmental Sciences'},
            { value: 'UQ:292967', label: 'School of Earth Sciences Papers'},
            { value: 'UQ:161068', label: 'School of Earth Sciences Publications'},
            { value: 'UQ:292966', label: 'School of Earth Sciences Reprint Publications'},
            { value: 'UQ:3817', label: 'School of Economics Publications'},
            { value: 'UQ:3856', label: 'School of Education Publications'},
            { value: 'UQ:3802', label: 'School of Engineering Publications'},
            { value: 'UQ:161208', label: 'School of Geography, Planning and Environmental Management Publications'},
            { value: 'UQ:3827', label: 'School of Health and Rehabilitation Sciences Publications'},
            { value: 'UQ:3810', label: 'School of Historical and Philosophical Inquiry'},
            { value: 'UQ:3829', label: 'School of Human Movement and Nutrition Sciences Publications'},
            { value: 'UQ:3801', label: 'School of Information Technology and Electrical Engineering Publications'},
            { value: 'UQ:185355', label: 'School of Languages and Cultures -- Student Publications'},
            { value: 'UQ:3838', label: 'School of Languages and Cultures Publications'},
            { value: 'UQ:161065', label: 'School of Mathematics and Physics'},
            { value: 'UQ:614615', label: 'School of Mechanical &amp; Mining Engineering - Student Publications - Open Access'},
            { value: 'UQ:614614', label: 'School of Mechanical &amp; Mining Engineering - Student Publications - Staff and students only'},
            { value: 'UQ:195548', label: 'School of Mechanical &amp; Mining Engineering Publications'},
            { value: 'UQ:3831', label: 'School of Medicine Publications'},
            { value: 'UQ:3813', label: 'School of Music Publications'},
            { value: 'UQ:3835', label: 'School of Nursing, Midwifery and Social Work Publications'},
            { value: 'UQ:3833', label: 'School of Pharmacy Publications'},
            { value: 'UQ:3806', label: 'School of Physical Sciences Publications'},
            { value: 'UQ:3850', label: 'School of Political Science and International Studies Publications'},
            { value: 'UQ:3852', label: 'School of Psychology Publications'},
            { value: 'UQ:3751', label: 'School of Public Health Publications'},
            { value: 'UQ:3854', label: 'School of Social Science Publications'},
            { value: 'UQ:3840', label: 'School of Veterinary Science Publications'},
            { value: 'UQ:351425', label: 'Science of Learning Centre Publications'},
            { value: 'UQ:308300', label: 'Scopus Import'},
            { value: 'UQ:682344', label: 'Scopus Import - Archived'},
            { value: 'UQ:151266', label: 'Security and Surveillance Collection'},
            { value: 'UQ:12343', label: 'Selected Papers of the 2006 Annual Meeting of the Australian Linguistic Society'},
            { value: 'UQ:178046', label: 'Selected Triple P'},
            { value: 'UQ:185192', label: 'Self Directed Triple P'},
            { value: 'UQ:152799', label: 'Semper Floreat'},
            { value: 'UQ:13605', label: 'Semper Floreat Digital Archive'},
            { value: 'UQ:7543', label: 'Social Research Centre Publications'},
            { value: 'UQ:212972', label: 'Spatial Ecology Lab Publications'},
            { value: 'UQ:3534', label: 'Speculative Fiction Display'},
            { value: 'UQ:178047', label: 'Standard Triple P'},
            { value: 'UQ:348666', label: 'Stead, Naomi - Equity and Diversity in the Australian Architectural Profession '},
            { value: 'UQ:178048', label: 'Stepping Stones Triple P'},
            { value: 'UQ:3862', label: 'Sustainable Minerals Institute Publications'},
            { value: 'UQ:288581', label: 'Sydney Olympics 2000'},
            { value: 'UQ:3935', label: 'System Documentation and Instructions'},
            { value: 'UQ:3819', label: 'TC Beirne School of Law Publications'},
            { value: 'UQ:23759', label: 'Teaching and Learning Projects'},
            { value: 'UQ:3917', label: 'Technology and Innovation Management Centre Publications'},
            { value: 'UQ:178049', label: 'Teen Triple P'},
            { value: 'UQ:152060', label: 'TEMPORARY EndNote import for SBMS'},
            { value: 'UQ:253670', label: 'Temporary Review'},
            { value: 'UQ:12841', label: 'The Future of Tobacco Control'},
            { value: 'UQ:178032', label: 'The Triple P Evidence-Base'},
            { value: 'UQ:185191', label: 'Theoretical Development of Triple P'},
            { value: 'UQ:151347', label: 'Thorn Laboratory Publications'},
            { value: 'UQ:289115', label: 'Toby Dix St George Publications'},
            { value: 'UQ:13634', label: 'Traditional Pacific Architecture - Photographs and Writings'},
            { value: 'UQ:178050', label: 'Triple P Media and Communication'},
            { value: 'UQ:178051', label: 'Triple P Programs at a Glance'},
            { value: 'UQ:178052', label: 'Triple P Video Blog'},
            { value: 'UQ:12811', label: 'UNE Main Collection'},
            { value: 'UQ:12810', label: 'UNE RQF Trial Collection'},
            { value: 'UQ:177646', label: 'University of Queensland Archives'},
            { value: 'UQ:678478', label: 'University of Queensland Archives (Restricted)'},
            { value: 'UQ:406017', label: 'University of Queensland Archives - Moving Images 1'},
            { value: 'UQ:288620', label: 'University of Queensland Buildings'},
            { value: 'UQ:119822', label: 'University of Queensland Library Images'},
            { value: 'UQ:12136', label: 'University of Queensland Library Publications'},
            { value: 'UQ:723084', label: 'University of Queensland Library Sound and Vision'},
            { value: 'UQ:3884', label: 'University of Queensland Library Staff Publications and Presentations'},
            { value: 'UQ:12952', label: 'University of Queensland Working Papers in Linguistics'},
            { value: 'UQ:218198', label: 'Unprocessed Records'},
            { value: 'UQ:185146', label: 'UQ Art Museum'},
            { value: 'UQ:7547', label: 'UQ Boilerhouse Community Engagement Centre - Publications'},
            { value: 'UQ:3815', label: 'UQ Business School Publications'},
            { value: 'UQ:171723', label: 'UQ Centre for Clinical Research Publications'},
            { value: 'UQ:152015', label: 'UQ Cultural History Project'},
            { value: 'UQ:282517', label: 'UQ Diamantina Institute - Open Access Collection'},
            { value: 'UQ:3931', label: 'UQ Diamantina Institute Publications'},
            { value: 'UQ:698676', label: 'UQ Gatton Past Students` Association'},
            { value: 'UQ:211157', label: 'UQ Library - Digitised Materials - Metadata only'},
            { value: 'UQ:209864', label: 'UQ Library - Digitised Materials - open access'},
            { value: 'UQ:275689', label: 'UQ Library - Digitised Materials - Out of Print - UQ Staff and Students Only'},
            { value: 'UQ:261912', label: 'UQ Library - Digitised Materials - UQ staff and students only'},
            { value: 'UQ:230658', label: 'UQ Library - Scholarly Communication and Digitisation Services'},
            { value: 'UQ:682642', label: 'UQ Library Facilities (Restricted)'},
            { value: 'UQ:405801', label: 'UQ Poche Centre for Indigenous Health'},
            { value: 'UQ:207608', label: 'UQ Press - administration only'},
            { value: 'UQ:11395', label: 'UQ Press - books, book chapters and bibliographies'},
            { value: 'UQ:124187', label: 'UQ Sound and Vision'},
            { value: 'UQ:342107', label: 'UQ Theses (HDR) - Citation only (Full-text embargoed)'},
            { value: 'UQ:335745', label: 'UQ Theses (HDR) - Embargoed (eSpace Admin only)'},
            { value: 'UQ:210175', label: 'UQ Theses (HDR) - Official'},
            { value: 'UQ:216495', label: 'UQ Theses (HDR) - Open Access'},
            { value: 'UQ:130846', label: 'UQ Theses (HDR) - UQ staff and students only'},
            { value: 'UQ:525542', label: 'UQ Theses (Higher Doctorate) - UQ staff and students only'},
            { value: 'UQ:216496', label: 'UQ Theses (non-HDR) - Open Access'},
            { value: 'UQ:183974', label: 'UQ Theses (non-HDR) - UQ staff and students only'},
            { value: 'UQ:11408', label: 'UQ Theses - Citation only'},
            { value: 'UQ:152694', label: 'UQ Theses Submission and Review'},
            { value: 'UQ:266465', label: 'Viney, Liam - Innovation and Tradition: 20th Century Chamber Music'},
            { value: 'UQ:718309', label: 'Viney, Liam - Music criticism: culture and politics'},
            { value: 'UQ:717779', label: 'Viney, Liam and Grinberg, Anna - Expanding International Duo Pianism: New and Traditional Works'},
            { value: 'UQ:352054', label: 'Viney, Liam and Grinberg, Anna - Innovating Australian Two-Piano Repertoire and Performance Through Commissions'},
            { value: 'UQ:352057', label: 'Viney, Liam and Grinberg, Anna - New Approaches to Piano Duet Performance'},
            { value: 'UQ:352056', label: 'Viney, Liam and Grinberg, Anna - Performing Two-Piano Innovations: Dialogic Relations'},
            { value: 'UQ:717776', label: 'Viney, Liam and Grinberg, Anna - Piano Spheres: Collaborative Duo Piano Performance and the Pianist as Critic'},
            { value: 'UQ:717777', label: 'Viney, Liam and Grinberg, Anna - Two Pianos Plus: Pianists Collaborating with Ensembles and Orchestras'},
            { value: 'UQ:717773', label: 'Viney, Liam and Grinberg, Anna – Dance Dialogues: Commissioning a new four-hand piano sonata and collaborating with the Queensland Ballet'},
            { value: 'UQ:717774', label: 'Viney, Liam et al. - White Halo Ensemble: New Directions in Collaborative Music Making'},
            { value: 'UQ:229001', label: 'W T Collection'},
            { value: 'UQ:195158', label: 'W.H. Bryan Mining Geology Research Centre'},
            { value: 'UQ:697530', label: 'Watson, Don et al. - Encyclopedia of Australian Architecture'},
            { value: 'UQ:717793', label: 'White, Jessica - Portfolio of short fiction'},
            { value: 'UQ:717794', label: 'Wilkins, Kim - Portfolio of short fiction'},
            { value: 'UQ:13199', label: 'Working Papers (School of Economics)'},
            { value: 'UQ:185194', label: 'Workplace Triple P'},
            { value: 'UQ:180159', label: 'WoS Import'},
            { value: 'UQ:682345', label: 'WoS Import - Archived'},
            { value: 'UQ:259725', label: 'Zhukov, Katie - Piano music by Australian Women composers - giving voice to women composers'},
            { value: 'UQ:259726', label: 'Zhukov, Katie - Wirripang Australian Piano Anthology: New Repertoire for Piano Pedagogy'},
        ];
        return (
            <StandardPage>
                <Hidden xsDown>
                    <KeyboardEventHandler
                        handleKeys={['ctrl+shift+left', 'ctrl+shift+right', 'ctrl+shift+up', 'ctrl+shift+down']}
                        onKeyEvent={this.handleKeyEvent}
                        handleFocusableElements
                    />
                    <Grid container direction={'row'} alignItems={'center'} style={{marginTop: -24}}>
                        <Grid item xs style={{marginBottom: 12}}>
                            <Typography variant={'h5'} color={'primary'} style={{fontSize: 24}}>{PIDtitle}</Typography>
                        </Grid>
                        <Grid item xs={'auto'}>
                            <Grid container direction={'row'} spacing={0} alignItems={'center'}>
                                <Grid item>
                                    <Tooltip title={`Switch to ${this.state.tabbed ? 'full form' : 'tabbed'} mode`}>
                                        <Switch
                                            color={'primary'}
                                            checked={this.state.tabbed}
                                            onChange={this.handleFormatChange}
                                            value="tabbed"
                                        />
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <Badge classes={{badge: classes.badgeMargin}} badgeContent={'?'} color="secondary">
                                        <HelpIcon
                                            icon={<Keyboard className={classes.helpIcon} />}
                                            tooltip={'Learn about keyboard shortcuts'}
                                            title={'Keyboard shortcuts'}
                                            text={(
                                                <React.Fragment>
                                                    <br/>
                                                    <Typography variant={'h6'} component={'p'}>Tab navigation</Typography>
                                                    <p>To navigate tabs while in tabbed mode, hold CTRL and SHIFT and use the LEFT and RIGHT arrow keys.</p>
                                                    <Typography variant={'h6'} component={'p'}>Form style</Typography>
                                                    <p>To switch between tabbed or full form mode, hold CTRL and SHIFT and use the UP and DOWN arrow keys.</p>
                                                    <p>Your preference is saved as a cookie on this browser and it will remember your preference.</p>
                                                </React.Fragment>
                                            )}
                                            buttonLabel={'GOT IT'}
                                        />
                                    </Badge>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0} direction={'row'}>
                        {
                            this.state.tabbed &&
                                <Grid item xs={12}>
                                    <Tabs value={this.state.tabValue}
                                        style={{marginRight: -56, marginLeft: -56}}
                                        classes={{indicator: classes.tabIndicator}}
                                        onChange={this.handleTabChange}
                                        scrollable
                                        scrollButtons={'on'}
                                        indicatorColor="primary"
                                        textColor="primary">
                                        <Tab label="Identifiers"/>
                                        <Tab label="Bibliographic"/>
                                        <Tab label="Admin"/>
                                        <Tab label="Author Affiliation"/>
                                        <Tab label="Files"/>
                                        <Tab label="Security"/>
                                    </Tabs>
                                </Grid>
                        }
                    </Grid>
                </Hidden>
                {/* --------------- Content here ---------------*/}
                <Grid container spacing={16}>
                    <Hidden smUp>
                        <Grid item xs>
                            <Typography variant={'h5'} color={'primary'} style={{fontSize: 24}}>{PIDtitle}</Typography>
                        </Grid>
                    </Hidden>
                    {
                        ((this.state.tabbed && this.state.tabValue === 0) || !this.state.tabbed) &&
                        <Grid item xs={12}>
                            <StandardCard title={'Identifiers'} primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                <Grid container spacing={8}>

                                    <Grid item xs={12} sm={12}>
                                        <Typography variant={'body2'} component={'p'}>Some explanatory text might go here. It may not. Time will tell.</Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <DownshiftMultiple
                                            initialValue={this.state.collection}
                                            sendData={this.handleMultiChipData}
                                            label={'Collection'}
                                            placeholder={'Begin typing to select a collection(s)'}
                                            optionsList={collectionItems}
                                            name={'collection'} />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Wos ID (ISI Loc)"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Wos Doc Type/s"
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                    }
                    {
                        ((this.state.tabbed && this.state.tabValue === 1) || !this.state.tabbed) &&
                        <Grid item xs={12}>
                            <StandardCard title={'Contributors'} primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                <Grid container spacing={16}>
                                    <Grid item xs={12} sm={12}>
                                        <Typography variant={'body2'} component={'p'}>Some explanatory text might go here. It may not. Time will tell.</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test"
                                            autoFocus={!!this.state.tabbed && this.state.tabValue === 1}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test2"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            label="Test3"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test4"
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                    }
                    {
                        ((this.state.tabbed && this.state.tabValue === 2) || !this.state.tabbed) &&
                        <Grid item xs={12}>
                            <StandardCard title={'Identifiers'} primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                <Grid container spacing={16}>
                                    <Grid item xs={12} sm={12}>
                                        <Typography variant={'body2'} component={'p'}>Some explanatory text might go here. It may not. Time will tell.</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test"
                                            autoFocus={!!this.state.tabbed && this.state.tabValue === 2}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test2"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            label="Test3"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test4"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test5"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test6"
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                    }
                    {
                        ((this.state.tabbed && this.state.tabValue === 3) || !this.state.tabbed) &&
                        <Grid item xs={12}>
                            <StandardCard title={'Meta data'} primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                <Grid container spacing={16}>
                                    <Grid item xs={12} sm={12}>
                                        <Typography variant={'body2'} component={'p'}>Some explanatory text might go here. It may not. Time will tell.</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test"
                                            autoFocus={!!this.state.tabbed && this.state.tabValue === 3}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test2"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            label="Test3"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test4"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test5"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test6"
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                    }
                    {
                        ((this.state.tabbed && this.state.tabValue === 4) || !this.state.tabbed) &&
                        <Grid item xs={12}>
                            <StandardCard title={'Files'} primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                <Grid container spacing={16}>
                                    <Grid item xs={12} sm={12}>
                                        <Typography variant={'body2'} component={'p'}>Some explanatory text might go here. It may not. Time will tell.</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            label="Test"
                                            autoFocus={!!this.state.tabbed && this.state.tabValue === 4}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                    }
                    {
                        ((this.state.tabbed && this.state.tabValue === 5) || !this.state.tabbed) &&
                        <Grid item xs={12}>
                            <StandardCard title={'Security'} primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                <Grid container spacing={16}>
                                    <Grid item xs={12} sm={12}>
                                        <Typography variant={'body2'} component={'p'}>Some explanatory text might go here. It may not. Time will tell.</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name={'confirmed'}
                                                    checked={this.state.security.confirmed}
                                                    onChange={this.handleSecurityConfirmChange}
                                                    color={this.state.security.confirmed ? 'primary' : 'default'}
                                                />
                                            }
                                            label={'I confirm that something is confirmed, and in confirming this confirmation, that something else will be confirmed.'} />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                    }
                </Grid>
            </StandardPage>
        );
    }
}

const AdminWithWidth = withWidth()(Admin);
export default withStyles(styles, {withTheme: true})(AdminWithWidth);
