import { render, screen } from '@testing-library/react';
import React from 'react';

import { LokiDatasource } from '../../datasource';
import { createLokiDatasource } from '../../mocks';
import { LokiQuery } from '../../types';

import { LabelBrowserModal, Props } from './LabelBrowserModal';

jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  reportInteraction: jest.fn(),
}));

describe('LabelBrowserModal', () => {
  let datasource: LokiDatasource, props: Props;

  beforeEach(() => {
    datasource = createLokiDatasource();

    props = {
      isOpen: true,
      languageProvider: datasource.languageProvider,
      query: {} as LokiQuery,
      onClose: jest.fn(),
      onChange: jest.fn(),
      onRunQuery: jest.fn(),
    };

    jest.spyOn(datasource, 'metadataRequest').mockResolvedValue({});
  });

  it('passes...', () => {
    render(<LabelBrowserModal {...props} />);
    expect(screen.getByRole('heading', { name: /label browser/i })).toBeInTheDocument();
  });
});
