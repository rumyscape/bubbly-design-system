## About

- token 값들을 담는 json 파일은 [DTCG 포맷](https://www.designtokens.org/tr/third-editors-draft/format/)을 따르는 것을 원칙으로 합니다.
    - 예외적으로 파일 이름은 *.tokens.json (or *.tokens.jsonc) 이여야 합니다. *.tokens 는 사용하지 않습니다.
- schema.json 파일은 최소한의 포맷 검증을 위해 사용하는 파일입니다.
    - DTCG 포맷과 완벽히 호환되게 만드는 것이 목표입니다.

## Conventions

- Naming은 reserved name이 아니라면 kebab-case 를 사용합니다.

### Text

- 모든 typography는 별도의 객체로 감싸지 않습니다. (감쌀 경우 build 되는 css에 불필요하게 prefix가 붙습니다.)
- 하나의 typography에 font-weight가 하나라면 아래처럼 선업합니다.

```json
{
  ...
  "title1": {
    "$value": {
      "fontWeight": 700,
      "fontSize": "28px",
      "lineHeight": "42px"
    }
  }
  ...
}
```

- 하나의 typography에 font-weight가 여러 개라면 아래와 같이 font-weight를 suffix로 붙입니다.
```json
{
  ...
  "body1-regular": {
    "$value": {
      "fontWeight": 400,
      "fontSize": "16px",
      "lineHeight": "26px"
    }
  },
  "body1-semibold": {
    "$value": {
      "fontWeight": 600,
      "fontSize": "16px",
      "lineHeight": "26px"
    }
  }
  ...
}
```