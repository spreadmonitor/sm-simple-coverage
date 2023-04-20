# sm-simple-coverage

A Github Action to calculate simple project coverage for pull requests.

It only supports line coverage metric at the moment, but it supports multi source coverage which means if multiple
coverage input file is defined then the action first merges them then reports a summary coverage value.

### Configuration

At the moment two input parameter is available:

- `line-coverage-threshold` - The threshold value that the project line coverage should pass. If not defined, then `0`
  is used.
- `coverage-report-paths` - Absolute or relative paths to the coverage-final report JSON files. If not defined,
  then `./coverage/coverage-final.json` is used.

```yaml
      - name: Simple coverage
        uses: ./
        with:
          line-coverage-threshold: 50
          coverage-report-paths: |
            ./example-coverage-1.json
            ./example-coverage-2.json
            ./coverage/example-coverage-3.json
```
