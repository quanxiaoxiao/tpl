/** @jsx jsx */
import React, { Fragment, useState } from 'react';
import { jsx, css } from '@emotion/core';
import request from 'api/request';
import curd from 'utils/curd';
import useColor from 'hooks/useColor';
import useActionDo from 'hooks/useActionDo';
import Table from 'components/Table';
import Layout from 'components/Layout';
import AddModal from './AddModal';
import Update from './Update';

const Topic = React.memo(() => {
  const [addModalShow, setAddModalShow] = useState(false);
  const [list, setList] = useState([]);
  const getColor = useColor();

  useActionDo(null, {
    fn: () => request.get('/api/projects'),
    resolve: (ret) => {
      setList(ret);
    },
  });

  return (
    <Fragment>
      <div
        css={css`
          height: 100%;
          padding: 1rem;
        `}
      >
        <div>
          <button
            type="button"
            onClick={() => setAddModalShow(true)}
          >
            add
          </button>
        </div>
        <Table
          css={css`
            [aria-label=table-header] {
              height: 3rem;
              [aria-label=table-cell] {
                text-align: center;
              }
            }
            [aria-label=table-row] {
              height: 3rem;
            }
          `}
          columns={[
            {
              elem: (<span>num</span>),
              dataKey: 'num',
              width: 6,
            },
            {
              elem: (<span>name</span>),
              dataKey: 'name',
            },
            {
              elem: (<span>operation</span>),
              dataKey: 'operation',
            },
          ]}
          list={list.map((item, i) => ({
            ...item,
            num: (
              <div
                css={css`
                  text-align: center;
                `}
              >
                <span>{i + 1}</span>
              </div>
            ),
            name: (
              <div
                css={css`
                  text-align: center;
                `}
              >
                <span>{item.name}</span>
              </div>
            ),
            operation: (
              <Layout
                justify="center"
              >
                <Layout.Item>
                  <button
                    type="button"
                    onClick={() => {
                      request.remove(`/api/project/${item.id}`);
                      setList(curd.remove(list, item.id));
                    }}
                  >
                    delete
                  </button>
                </Layout.Item>
                <Layout.Item
                  gap="0.6rem"
                >
                  <Update
                    item={item}
                    onUpdate={(v) => setList(curd.update(list, v))}
                  />
                </Layout.Item>
              </Layout>
            ),
          }))}
        />
      </div>
      {
        addModalShow && (
          <AddModal
            onClose={() => setAddModalShow(false)}
            onAdd={(v) => setList(curd.append(list, v))}
          />
        )
      }
    </Fragment>
  );
});

export default Topic;
