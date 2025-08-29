'use client'

import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { useField, useFormikContext } from 'formik'
import Fuse from 'fuse.js'

export default function FuzzySelect({ name, exchange = 'NFO', placeholder }) {
  const [field, , helpers] = useField(name)
  const { setFieldValue } = useFormikContext()
  const [options, setOptions] = useState([])
  const [fuse, setFuse] = useState(null)

  useEffect(() => {
    async function loadData() {
      const res = await fetch(`/data/NFO.json`)
      const json = await res.json()

      const fuseInstance = new Fuse(json, {
        keys: ['tradingSymbol', 'name'],
        threshold: 0.3,
      })

      setFuse(fuseInstance)
    }

    loadData()
  }, [exchange])

  const handleInputChange = (inputValue) => {
    if (!fuse || !inputValue) {
      setOptions([])
      return
    }

    const results = fuse.search(inputValue).map(({ item }) => ({
      value: item.tradingSymbol,
      label: `${item.tradingSymbol} (${item.name})`,
      data: item,
    }))

    setOptions(results)
  }

  const handleChange = (selected) => {
    helpers.setValue(selected)
  }

  return (
    <Select
      name={name}
      value={field.value}
      options={options}
      onInputChange={handleInputChange}
      onChange={handleChange}
      placeholder={placeholder || 'Search symbol...'}
      isClearable
      isSearchable
      noOptionsMessage={() => 'No match found'}
    />
  )
}
