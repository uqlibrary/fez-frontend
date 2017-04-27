import React, {Component} from 'react';
import {PublicationTypeForm} from '../../Forms/PublicationType';
import {AddJournalArticleForm} from '../../Forms/JournalArticle';
import PropTypes from 'prop-types';

export default class AddRecord extends Component {

    static propTypes = {
        selectedPublication: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {selectedPublication} = this.props;

        return (
            <div className="layout-fill">
                <h1 className="page-title display-1">Add a journal article</h1>
                <PublicationTypeForm
                    title="Add your publication"
                    helpText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc."
                    helpTitle="Add your publication"
                    maxSearchResults={10}
                    label="Select a publication type">

                    {/* Journal Article is selected */}
                    {selectedPublication && selectedPublication.get('name') === 'Journal Article' &&
                        <div>
                            <AddJournalArticleForm />
                        </div>
                    }
                </PublicationTypeForm>
            </div>
        );
    }
}
