import * as React from 'react';
import './namespace-form.scss';

import { Form, FormGroup, TextInput, TextArea } from '@patternfly/react-core';
import { MinusCircleIcon, PlusCircleIcon } from '@patternfly/react-icons';

import { NamespaceCard, ObjectPermissionField } from '../../components';
import { NamespaceType } from '../../api';

interface IProps {
  namespace: NamespaceType;
  errorMessages: any;
  userId: string;

  updateNamespace: (namespace) => void;
}

interface IState {
  newLinkName: string;
  newLinkURL: string;
  newNamespaceGroup: string;
}

export class NamespaceForm extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      newLinkURL: '',
      newLinkName: '',
      newNamespaceGroup: '',
    };
  }

  render() {
    const { namespace, errorMessages, userId } = this.props;

    if (!namespace) {
      return null;
    }
    return (
      <Form>
        <div className='card-row'>
          <div className='fields'>
            <FormGroup fieldId='name' label='Name' isRequired>
              <TextInput
                isRequired
                isDisabled
                id='name'
                type='text'
                value={namespace.name}
              />
            </FormGroup>

            <br />

            <FormGroup
              fieldId='company'
              label='Company name'
              helperTextInvalid={errorMessages['company']}
              validated={this.toError(!('company' in errorMessages))}
            >
              <TextInput
                validated={this.toError(!('company' in errorMessages))}
                isRequired
                id='company'
                type='text'
                value={namespace.company}
                onChange={(value, event) => this.updateField(value, event)}
              />
            </FormGroup>
          </div>
          <div className='card'>
            <NamespaceCard {...namespace} />
          </div>
        </div>

        <FormGroup
          fieldId='groups'
          label='Namespace owners'
          helperTextInvalid={errorMessages['groups']}
          validated={this.toError(
            !isNaN(Number(this.state.newNamespaceGroup)) &&
              !('groups' in errorMessages),
          )}
        >
          <br />

          <ObjectPermissionField
            groups={namespace.groups}
            availablePermissions={['change_namespace', 'upload_to_namespace']}
            setGroups={g => {
              const newNS = { ...namespace };
              newNS.groups = g;
              this.props.updateNamespace(newNS);
            }}
          ></ObjectPermissionField>
        </FormGroup>

        <FormGroup
          fieldId='avatar_url'
          label='Logo URL'
          helperTextInvalid={errorMessages['avatar_url']}
          validated={this.toError(!('avatar_url' in errorMessages))}
        >
          <TextInput
            validated={this.toError(!('avatar_url' in errorMessages))}
            id='avatar_url'
            type='text'
            value={namespace.avatar_url}
            onChange={(value, event) => this.updateField(value, event)}
          />
        </FormGroup>

        <FormGroup
          fieldId='description'
          label='Description'
          helperTextInvalid={errorMessages['description']}
          validated={this.toError(!('description' in errorMessages))}
        >
          <TextArea
            validated={this.toError(!('description' in errorMessages))}
            id='description'
            type='text'
            value={namespace.description}
            onChange={(value, event) => this.updateField(value, event)}
          />
        </FormGroup>

        {namespace.links.length > 0 ? (
          <FormGroup
            fieldId='links'
            label='Useful links'
            helperTextInvalid={errorMessages['name'] || errorMessages['url']}
          >
            {namespace.links.map((link, index) =>
              this.renderLinkGroup(link, index),
            )}
          </FormGroup>
        ) : null}

        <FormGroup fieldId='add_link' label='Add link'>
          <div className='useful-links'>
            <div className='link-name'>
              <TextInput
                id='name'
                type='text'
                placeholder='Link text'
                value={this.state.newLinkName}
                onChange={value => {
                  this.setState({
                    newLinkName: value,
                  });
                }}
              />
            </div>
            <div className='link-url'>
              <TextInput
                id='url'
                type='text'
                placeholder='Link URL'
                value={this.state.newLinkURL}
                onChange={value =>
                  this.setState({
                    newLinkURL: value,
                  })
                }
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    this.addLink();
                  }
                }}
              />
            </div>
            <div className='clickable link-button'>
              <PlusCircleIcon onClick={() => this.addLink()} size='md' />
            </div>
          </div>
        </FormGroup>
      </Form>
    );
  }

  private toError(validated: boolean) {
    if (validated) {
      return 'default';
    } else {
      return 'error';
    }
  }

  private updateField(value, event) {
    const update = { ...this.props.namespace };
    update[event.target.id] = value;
    this.props.updateNamespace(update);
  }

  private updateLink(index, value, event) {
    const update = { ...this.props.namespace };
    update.links[index][event.target.id] = value;
    this.props.updateNamespace(update);
  }

  private removeLink(index) {
    const update = { ...this.props.namespace };
    update.links.splice(index, 1);
    this.props.updateNamespace(update);
  }

  private addLink() {
    const update = { ...this.props.namespace };
    update.links.push({
      name: this.state.newLinkName,
      url: this.state.newLinkURL,
    });
    this.setState(
      {
        newLinkURL: '',
        newLinkName: '',
      },
      () => this.props.updateNamespace(update),
    );
  }

  private renderLinkGroup(link, index) {
    return (
      <div className='useful-links' key={index}>
        <div className='link-name'>
          <TextInput
            id='name'
            type='text'
            placeholder='Link text'
            value={link.name}
            onChange={(value, event) => this.updateLink(index, value, event)}
          />
        </div>
        <div className='link-url'>
          <TextInput
            id='url'
            type='text'
            placeholder='Link URL'
            value={link.url}
            onChange={(value, event) => this.updateLink(index, value, event)}
          />
        </div>
        <div className='link-button'>
          <MinusCircleIcon
            className='clickable'
            onClick={() => this.removeLink(index)}
            size='md'
          />
        </div>
      </div>
    );
  }
}
